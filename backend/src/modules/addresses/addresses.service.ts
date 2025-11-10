import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo endereço para o usuário
   * Se isDefault=true, desmarca os outros como padrão
   */
  async create(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault, ...addressData } = createAddressDto;

    // Se for marcar como padrão, desmarcar os outros
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.create({
      data: {
        ...addressData,
        isDefault: isDefault ?? false,
        userId,
      },
    });

    this.logger.log(`Endereço ${address.id} criado para usuário ${userId}`);

    return {
      message: 'Endereço criado com sucesso',
      address,
    };
  }

  /**
   * Lista todos os endereços do usuário
   * Ordenados por isDefault (padrão primeiro) e data de criação
   */
  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Busca um endereço específico
   * Verifica se o endereço pertence ao usuário
   */
  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    // Verificar ownership
    if (address.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este endereço',
      );
    }

    return address;
  }

  /**
   * Atualiza um endereço
   * Verifica ownership e gerencia isDefault
   */
  async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
    // Verificar se o endereço existe e pertence ao usuário
    await this.findOne(id, userId);

    const { isDefault, ...addressData } = updateAddressDto;

    // Se marcar como padrão, desmarcar os outros
    if (isDefault === true) {
      await this.prisma.address.updateMany({
        where: { userId, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.update({
      where: { id },
      data: {
        ...addressData,
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    this.logger.log(`Endereço ${id} atualizado pelo usuário ${userId}`);

    return {
      message: 'Endereço atualizado com sucesso',
      address,
    };
  }

  /**
   * Marca um endereço como padrão
   * Desmarca automaticamente os outros
   */
  async setDefault(id: string, userId: string) {
    // Verificar se o endereço existe e pertence ao usuário
    await this.findOne(id, userId);

    // Desmarcar todos como padrão
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Marcar o endereço como padrão
    const address = await this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    this.logger.log(
      `Endereço ${id} marcado como padrão pelo usuário ${userId}`,
    );

    return {
      message: 'Endereço marcado como padrão',
      address,
    };
  }

  /**
   * Remove um endereço
   * Verifica se não há pedidos ativos usando este endereço
   */
  async remove(id: string, userId: string) {
    // Verificar se o endereço existe e pertence ao usuário
    await this.findOne(id, userId);

    // Verificar se há pedidos em andamento usando este endereço
    const activeOrders = await this.prisma.order.count({
      where: {
        addressId: id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'],
        },
      },
    });

    if (activeOrders > 0) {
      throw new BadRequestException(
        'Não é possível remover este endereço pois há pedidos ativos usando-o',
      );
    }

    await this.prisma.address.delete({
      where: { id },
    });

    this.logger.log(`Endereço ${id} removido pelo usuário ${userId}`);

    return {
      message: 'Endereço removido com sucesso',
    };
  }
}
