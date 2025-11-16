import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../database/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lista todos os usuários (apenas para ADMIN)
   */
  async findAll() {
    return this.prisma.user.findMany({
      where: { isActive: true },
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
        updatedAt: true,
      },
    });

    return {
      message: 'Usuário desativado com sucesso',
      user: deactivatedUser,
    };
  }
}
