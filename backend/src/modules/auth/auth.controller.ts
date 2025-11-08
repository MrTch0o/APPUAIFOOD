import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Enable2FADto } from './dto/enable-2fa.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';
import { Disable2FADto } from './dto/disable-2fa.dto';
import { Public } from '../../common/decorators/public.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de usuário',
    description:
      'Realiza login com email e senha. Se 2FA estiver ativado, retorna requires2FA=true e você deve chamar /auth/2fa/verify',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso ou 2FA necessário',
    schema: {
      oneOf: [
        {
          properties: {
            user: { type: 'object' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        {
          properties: {
            requires2FA: { type: 'boolean', example: true },
            userId: { type: 'string' },
            message: { type: 'string' },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar tokens' })
  @ApiResponse({ status: 200, description: 'Tokens renovados com sucesso' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout de usuário' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  async logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  // ==================== ENDPOINTS 2FA ====================

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gerar QR code para configurar 2FA' })
  @ApiResponse({
    status: 200,
    description: 'QR code gerado com sucesso',
    schema: {
      properties: {
        secret: { type: 'string', example: 'JBSWY3DPEHPK3PXP' },
        qrCode: {
          type: 'string',
          example: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
        },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: '2FA já está ativado' })
  async generate2FA(@GetUser('id') userId: string) {
    return this.authService.generate2FA(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ativar 2FA após escanear QR code' })
  @ApiResponse({ status: 200, description: '2FA ativado com sucesso' })
  @ApiResponse({ status: 401, description: 'Código 2FA inválido' })
  async enable2FA(
    @GetUser('id') userId: string,
    @Body() enable2FADto: Enable2FADto,
  ) {
    return this.authService.enable2FA(userId, enable2FADto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desativar 2FA' })
  @ApiResponse({ status: 200, description: '2FA desativado com sucesso' })
  @ApiResponse({ status: 401, description: 'Código 2FA inválido' })
  @ApiResponse({ status: 409, description: '2FA não está ativado' })
  async disable2FA(
    @GetUser('id') userId: string,
    @Body() disable2FADto: Disable2FADto,
  ) {
    return this.authService.disable2FA(userId, disable2FADto.token);
  }

  @Public()
  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar código 2FA durante login',
    description:
      'Este endpoint deve ser usado após o login inicial quando o usuário tem 2FA ativado',
  })
  @ApiResponse({ status: 200, description: 'Código verificado com sucesso' })
  @ApiResponse({ status: 401, description: 'Código 2FA inválido' })
  async verify2FA(
    @GetUser('id') userId: string,
    @Body() verify2FADto: Verify2FADto,
  ) {
    return this.authService.verify2FALogin(userId, verify2FADto.token);
  }
}
