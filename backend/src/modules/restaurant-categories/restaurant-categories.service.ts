import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RestaurantCategory } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateRestaurantCategoryDto,
  UpdateRestaurantCategoryDto,
} from './dto';

@Injectable()
export class RestaurantCategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova categoria de restaurante
   */
  async create(
    createDto: CreateRestaurantCategoryDto,
  ): Promise<RestaurantCategory> {
    // Verificar se já existe categoria com esse nome
    const existing: RestaurantCategory | null =
      await this.prisma.restaurantCategory.findUnique({
        where: { name: createDto.name },
      });

    if (existing) {
      throw new BadRequestException(
        `A categoria "${createDto.name}" já existe`,
      );
    }

    return await this.prisma.restaurantCategory.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        icon: createDto.icon,
        isActive: createDto.isActive ?? true,
      },
    });
  }

  /**
   * Lista todas as categorias de restaurante
   */
  async findAll(onlyActive = false): Promise<RestaurantCategory[]> {
    const where = onlyActive ? { isActive: true } : {};

    return await this.prisma.restaurantCategory.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Encontra uma categoria por ID
   */
  async findById(id: string): Promise<RestaurantCategory> {
    const category = await this.prisma.restaurantCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada`);
    }

    return category;
  }

  /**
   * Atualiza uma categoria
   */
  async update(
    id: string,
    updateDto: UpdateRestaurantCategoryDto,
  ): Promise<RestaurantCategory> {
    await this.findById(id); // Verificar se existe

    // Se está mudando o nome, verificar se já não existe outro com esse nome
    if (updateDto.name) {
      const existing = await this.prisma.restaurantCategory.findFirst({
        where: {
          name: updateDto.name,
          id: { not: id },
        },
      });

      if (existing) {
        throw new BadRequestException(
          `A categoria "${updateDto.name}" já existe`,
        );
      }
    }

    return await this.prisma.restaurantCategory.update({
      where: { id },
      data: {
        name: updateDto.name,
        description: updateDto.description,
        icon: updateDto.icon,
        isActive: updateDto.isActive,
      },
    });
  }

  /**
   * Deleta uma categoria
   */
  async delete(id: string): Promise<RestaurantCategory> {
    await this.findById(id);

    // Verificar se há restaurantes usando essa categoria
    const restaurantsCount: number = await this.prisma.restaurant.count({
      where: { restaurantCategoryId: id },
    });

    if (restaurantsCount > 0) {
      throw new BadRequestException(
        `Não é possível deletar a categoria. Existem ${restaurantsCount} restaurante(s) usando-a`,
      );
    }

    return await this.prisma.restaurantCategory.delete({
      where: { id },
    });
  }

  /**
   * Ativa uma categoria
   */
  async activate(id: string): Promise<RestaurantCategory> {
    await this.findById(id);

    return await this.prisma.restaurantCategory.update({
      where: { id },
      data: { isActive: true },
    });
  }

  /**
   * Desativa uma categoria
   */
  async deactivate(id: string): Promise<RestaurantCategory> {
    await this.findById(id);

    // Verificar se há restaurantes usando essa categoria
    const restaurantsCount: number = await this.prisma.restaurant.count({
      where: {
        restaurantCategoryId: id,
        isActive: true,
      },
    });

    if (restaurantsCount > 0) {
      throw new BadRequestException(
        `Não é possível desativar a categoria. Existem ${restaurantsCount} restaurante(s) ativo(s) usando-a`,
      );
    }

    return await this.prisma.restaurantCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
