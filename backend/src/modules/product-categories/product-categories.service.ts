import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto';
import { ProductCategory } from '@prisma/client';

@Injectable()
export class ProductCategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova categoria de produto
   */
  async create(createDto: CreateProductCategoryDto): Promise<ProductCategory> {
    // Verificar se já existe categoria com esse nome
    const existing: ProductCategory | null =
      await this.prisma.productCategory.findUnique({
        where: { name: createDto.name },
      });

    if (existing) {
      throw new BadRequestException(
        `A categoria "${createDto.name}" já existe`,
      );
    }

    return await this.prisma.productCategory.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        icon: createDto.icon,
        isActive: createDto.isActive ?? true,
      },
    });
  }

  /**
   * Lista todas as categorias de produto
   */
  async findAll(onlyActive = false): Promise<ProductCategory[]> {
    const where = onlyActive ? { isActive: true } : {};

    return await this.prisma.productCategory.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Encontra uma categoria por ID
   */
  async findById(id: string): Promise<ProductCategory> {
    const category: ProductCategory | null =
      await this.prisma.productCategory.findUnique({
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
    updateDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    await this.findById(id);

    // Se está mudando o nome, verificar se já não existe outro com esse nome
    if (updateDto.name) {
      const existing: ProductCategory | null =
        await this.prisma.productCategory.findFirst({
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

    return await this.prisma.productCategory.update({
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
  async delete(id: string): Promise<ProductCategory> {
    await this.findById(id);

    // Verificar se há produtos usando essa categoria
    const productsCount: number = await this.prisma.product.count({
      where: { productCategoryId: id },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        `Não é possível deletar a categoria. Existem ${productsCount} produto(s) usando-a`,
      );
    }

    return await this.prisma.productCategory.delete({
      where: { id },
    });
  }

  /**
   * Ativa uma categoria
   */
  async activate(id: string): Promise<ProductCategory> {
    await this.findById(id);

    return await this.prisma.productCategory.update({
      where: { id },
      data: { isActive: true },
    });
  }

  /**
   * Desativa uma categoria
   */
  async deactivate(id: string) {
    await this.findById(id);

    // Verificar se há produtos usando essa categoria
    const productsCount = await this.prisma.product.count({
      where: {
        productCategoryId: id,
        available: true,
      },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        `Não é possível desativar a categoria. Existem ${productsCount} produto(s) disponível(is) usando-a`,
      );
    }

    return this.prisma.productCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
