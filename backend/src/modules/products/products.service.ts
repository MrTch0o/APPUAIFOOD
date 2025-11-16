import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo produto
   */
  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      message: 'Produto criado com sucesso',
      product,
    };
  }

  /**
   * Lista todos os produtos para admin
   */
  async findAllAdmin(): Promise<unknown[]> {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        productCategoryId: true,
        restaurantId: true,
        isActive: true,
        preparationTime: true,
        createdAt: true,
        updatedAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Lista produtos de um restaurante (admin)
   */
  async findByRestaurantIdAdmin(restaurantId: string): Promise<unknown[]> {
    return this.prisma.product.findMany({
      where: { restaurantId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        productCategoryId: true,
        restaurantId: true,
        isActive: true,
        preparationTime: true,
        createdAt: true,
        updatedAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Lista produtos de um restaurante (restaurant owner)
   * Apenas retorna produtos do restaurante especificado
   * A autorização (RESTAURANT_OWNER) é feita no controller
   */
  async findByRestaurantIdOwner(
    restaurantId: string,
    userId: string,
  ): Promise<unknown[]> {
    // Verificar se o restaurante existe
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true, ownerId: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    // Se o restaurante tem um ownerId definido, verificar se o usuário é o proprietário
    if (restaurant.ownerId && restaurant.ownerId !== userId) {
      throw new NotFoundException(
        'Você não tem permissão para acessar os produtos deste restaurante',
      );
    }

    // Se não tem ownerId, apenas retornar os produtos (assume que é do usuário)
    return this.prisma.product.findMany({
      where: { restaurantId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        productCategoryId: true,
        restaurantId: true,
        isActive: true,
        preparationTime: true,
        createdAt: true,
        updatedAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Busca um produto específico (admin)
   */
  async findOneAdmin(id: string): Promise<unknown> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        productCategoryId: true,
        restaurantId: true,
        isActive: true,
        preparationTime: true,
        createdAt: true,
        updatedAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  /**
   * Lista todos os produtos (com filtros opcionais)
   */
  async findAll(restaurantId?: string, productCategoryId?: string) {
    const where: {
      restaurantId?: string;
      productCategoryId?: string;
      available?: boolean;
      isActive?: boolean;
    } = {
      available: true,
      isActive: true,
    };

    if (restaurantId) where.restaurantId = restaurantId;
    if (productCategoryId) where.productCategoryId = productCategoryId;

    return this.prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        productCategoryId: true,
        available: true,
        preparationTime: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Busca um produto específico
   */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            deliveryFee: true,
            deliveryTime: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se o produto está ativo
    if (!product.isActive) {
      throw new NotFoundException('Produto não disponível');
    }

    return product;
  }

  /**
   * Atualiza um produto
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    // Verificar se produto existe
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      message: 'Produto atualizado com sucesso',
      product,
    };
  }

  /**
   * Remove um produto
   */
  async remove(id: string) {
    // Verificar se produto existe
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Produto removido com sucesso',
    };
  }

  /**
   * Atualiza a imagem do produto
   */
  async updateImage(id: string, imageUrl: string) {
    // Verificar se produto existe
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: { image: imageUrl },
      select: {
        id: true,
        name: true,
        image: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Imagem do produto atualizada com sucesso',
      product,
    };
  }

  /**
   * Desativa um produto (soft delete)
   */
  async deactivate(id: string): Promise<unknown> {
    // Verificar se produto existe
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Produto desativado com sucesso',
      product,
    };
  }

  /**
   * Ativa um produto
   */
  async activate(id: string): Promise<unknown> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        name: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Produto ativado com sucesso',
      product: updated,
    };
  }
}
