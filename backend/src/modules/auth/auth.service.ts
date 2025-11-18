import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';
import { TwoFactorService } from './two-factor.service';

// Interface que define a estrutura do payload JWT
interface JwtPayload {
  sub: string; // ID do usuário
  email: string;
  role: UserRole;
  iat?: number; // Issued at (timestamp)
  exp?: number; // Expiration time (timestamp)
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private twoFactorService: TwoFactorService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, role } = registerDto;

    // Verificar se usuário já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário com role fornecido ou padrão (CLIENT)
    const userRole = role || UserRole.CLIENT;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Gerar tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Salvar refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      data: {
        user,
        ...tokens,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    console.log(`[AUTH] Login attempt for email: ${email}`);

    // Validar usuário
    const user = await this.validateUser(email, password);

    if (!user) {
      console.log(
        `[AUTH] Login failed - invalid credentials for email: ${email}`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log(
      `[AUTH] User found: ${user.id}, 2FA enabled: ${user.is2FAEnabled}`,
    );

    // Verificar se 2FA está ativado
    if (user.is2FAEnabled) {
      // Retornar flag indicando que 2FA é necessário
      return {
        data: {
          requires2FA: true,
          userId: user.id,
          message: 'Por favor, forneça o código 2FA para completar o login',
        },
      };
    }

    // Login normal sem 2FA
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          is2FAEnabled: user.is2FAEnabled,
        },
        ...tokens,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Usuário desativado. Entre em contato com o administrador.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verificar e decodificar o refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        data: tokens,
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return {
      data: {
        message: 'Logout realizado com sucesso',
      },
    };
  }

  private async generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  // ==================== MÉTODOS 2FA ====================

  /**
   * Gera secret e QR code para configuração do 2FA
   */
  async generate2FA(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, is2FAEnabled: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (user.is2FAEnabled) {
      throw new ConflictException('2FA já está ativado para este usuário');
    }

    // Gerar secret
    const { secret, otpauthUrl } = this.twoFactorService.generateSecret(
      user.email,
    );

    // Gerar QR code (otpauthUrl nunca é undefined quando geramos o secret)
    const qrCode = await this.twoFactorService.generateQRCode(otpauthUrl!);

    // Salvar secret temporariamente (será confirmado no enable)
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFASecret: secret },
    });

    return {
      data: {
        secret,
        qrCode,
        message:
          'Escaneie o QR code com seu app autenticador (Google Authenticator, Authy, etc.)',
      },
    };
  }

  /**
   * Ativa o 2FA após validar o token
   */
  async enable2FA(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFASecret: true, is2FAEnabled: true },
    });

    if (!user || !user.twoFASecret) {
      throw new UnauthorizedException('Você precisa gerar o QR code primeiro');
    }

    if (user.is2FAEnabled) {
      throw new ConflictException('2FA já está ativado');
    }

    // Validar token
    const isValid = this.twoFactorService.verifyToken(token, user.twoFASecret);

    if (!isValid) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    // Ativar 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: { is2FAEnabled: true },
    });

    return {
      data: {
        message: '2FA ativado com sucesso!',
        is2FAEnabled: true,
      },
    };
  }

  /**
   * Desativa o 2FA após validar o token
   */
  async disable2FA(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFASecret: true, is2FAEnabled: true },
    });

    if (!user || !user.is2FAEnabled) {
      throw new ConflictException('2FA não está ativado');
    }

    // Validar token
    const isValid = this.twoFactorService.verifyToken(token, user.twoFASecret!);

    if (!isValid) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    // Desativar 2FA e limpar secret
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        is2FAEnabled: false,
        twoFASecret: null,
      },
    });

    return {
      data: {
        message: '2FA desativado com sucesso!',
        is2FAEnabled: false,
      },
    };
  }

  /**
   * Verifica código 2FA durante o login
   */
  async verify2FALogin(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        is2FAEnabled: true,
        twoFASecret: true,
      },
    });

    if (!user || !user.is2FAEnabled || !user.twoFASecret) {
      throw new UnauthorizedException('Configuração 2FA inválida');
    }

    // Validar token
    const isValid = this.twoFactorService.verifyToken(token, user.twoFASecret);

    if (!isValid) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    // Gerar tokens JWT
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          is2FAEnabled: user.is2FAEnabled,
        },
        ...tokens,
      },
    };
  }
}
