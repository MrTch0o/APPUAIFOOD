import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PrismaService } from '../../database/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lista todos os usuários (apenas para ADMIN)
   */
  async findAll(role?: string) {
    const where: any = {};

    // Filtrar por role se fornecido
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      where.role = role;
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Cria um novo usuário (apenas para ADMIN)
   */
  async create(
    email: string,
    password: string,
    name: string,
    phone?: string,
    role: UserRole = UserRole.CLIENT,
  ) {
    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email já está registrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Usuário criado com sucesso',
      user: newUser,
    };
  }

  /**
   * Busca um usuário por ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  /**
   * Atualiza dados do usuário
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Verificar se usuário existe
    await this.findOne(id);

    // Se email foi fornecido, verificar se já está em uso por outro usuário
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          'Este email já está registrado por outro usuário',
        );
      }
    }

    // Se password foi fornecida, fazer hash
    const updateData: typeof updateUserDto & { password?: string } = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Atualizar usuário
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Perfil atualizado com sucesso',
      user: updatedUser,
    };
  }

  /**
   * Remove um usuário (soft delete ou hard delete)
   */
  async remove(id: string) {
    // Verificar se usuário existe
    await this.findOne(id);

    // Hard delete (pode ser mudado para soft delete depois)
    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'Usuário removido com sucesso',
    };
  }

  /**
   * Muda a role de um usuário (apenas ADMIN)
   */
  async updateRole(userId: string, newRole: UserRole) {
    // Verificar se usuário existe
    await this.findOne(userId);

    // Atualizar role
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return {
      message: `Papel do usuário alterado para ${newRole} com sucesso`,
      user: updatedUser,
    };
  }

  /**
   * Desativa um usuário (soft delete) - apenas ADMIN
   */
  async deactivate(userId: string) {
    // Verificar se usuário existe
    await this.findOne(userId);

    // Desativar usuário
    const deactivatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Usuário desativado com sucesso',
      user: deactivatedUser,
    };
  }

  /**
   * Ativa um usuário (reverte soft delete) - apenas ADMIN
   */
  async activate(userId: string) {
    // Verificar se usuário existe
    await this.findOne(userId);

    // Ativar usuário
    const activatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Usuário ativado com sucesso',
      user: activatedUser,
    };
  }

  /**
   * Muda a senha do usuário logado
   * Requer a senha atual para validação
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    // Buscar usuário com senha
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Validar senha atual
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    // Verificar se a nova senha é igual à atual
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual',
      );
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Atualizar senha
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Senha alterada com sucesso',
      user: updatedUser,
    };
  }

  /**
   * Reseta a senha de um usuário (ADMIN only)
   * Sem necessidade de validar a senha atual
   */
  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    // Verificar se usuário existe
    const user = await this.findOne(userId);

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    // Atualizar senha
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is2FAEnabled: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Senha resetada com sucesso',
      user: updatedUser,
    };
  }
}
