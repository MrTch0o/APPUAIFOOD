import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../database/prisma.service';

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
   * Lista todos os produtos (com filtros opcionais)
   */
  async findAll(restaurantId?: string, category?: string) {
    const where: {
      restaurantId?: string;
      category?: string;
      available?: boolean;
    } = {
      available: true,
    };

    if (restaurantId) where.restaurantId = restaurantId;
    if (category) where.category = category;

    return this.prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
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
}
