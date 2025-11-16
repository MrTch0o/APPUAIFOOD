import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo restaurante
   */
  async create(createRestaurantDto: CreateRestaurantDto, ownerId: string) {
    // Remover openingHours se for null ou undefined (outros campos são obrigatórios)
    const { openingHours, ...requiredFields } = createRestaurantDto;

    const createData: any = {
      ...requiredFields,
      ownerId,
    };

    // Adicionar openingHours apenas se estiver definido
    if (openingHours !== null && openingHours !== undefined) {
      createData.openingHours = openingHours;
    }

    const restaurant = await this.prisma.restaurant.create({
      data: createData,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return restaurant;
  }

  /**
   * Lista todos os restaurantes (apenas ativos para clientes)
   */
  async findAll(showInactive = false) {
    const where = showInactive ? {} : { isActive: true };

    return this.prisma.restaurant.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Lista todos os restaurantes para admin (ativo ou inativo)
   */
  async findAllAdmin() {
    return this.prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca um restaurante específico com seus produtos
   */
  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        products: {
          where: { available: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            category: true,
            available: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    return restaurant;
  }

  /**
   * Busca um restaurante específico para admin (com owner)
   */
  async findOneAdmin(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        restaurantCategoryId: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    return restaurant;
  }

  /**
   * Busca o restaurante do usuário logado (por ownerId)
   */
  async getByOwnerId(ownerId: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException(
        'Nenhum restaurante encontrado para este usuário',
      );
    }

    return {
      message: 'Restaurante do usuário encontrado',
      restaurant,
    };
  }

  /**
   * Atualiza um restaurante
   */
  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    // Verificar se restaurante existe
    await this.findOne(id);

    // Filtrar apenas campos undefined (null é válido para alguns campos)
    const updateData: any = Object.fromEntries(
      Object.entries(updateRestaurantDto).filter(
        ([, value]) => value !== undefined,
      ),
    );

    const restaurant = await this.prisma.restaurant.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return restaurant;
  }

  /**
   * Remove um restaurante (hard delete)
   */
  async remove(id: string) {
    // Verificar se restaurante existe
    await this.findOne(id);

    await this.prisma.restaurant.delete({
      where: { id },
    });

    return {
      message: 'Restaurante removido com sucesso',
    };
  }

  /**
   * Atualiza a imagem do restaurante
   */
  async updateImage(id: string, imageUrl: string) {
    // Verificar se restaurante existe
    await this.findOne(id);

    const restaurant = await this.prisma.restaurant.update({
      where: { id },
      data: { image: imageUrl },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return restaurant;
  }

  /**
   * Desativa um restaurante (soft delete)
   */
  async deactivate(id: string) {
    // Verificar se restaurante existe
    await this.findOne(id);

    const restaurant = await this.prisma.restaurant.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return restaurant;
  }

  /**
   * Ativa um restaurante
   */
  async activate(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    const updated = await this.prisma.restaurant.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openingHours: true,
        deliveryFee: true,
        deliveryTime: true,
        minimumOrder: true,
        category: true,
        image: true,
        isActive: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return updated;
  }
}
