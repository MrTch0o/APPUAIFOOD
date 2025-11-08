import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lista todos os usuários (apenas para ADMIN)
   */
  async findAll() {
    return this.prisma.user.findMany({
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
}
