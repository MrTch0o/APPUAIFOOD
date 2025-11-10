import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova avaliação
   * Validações:
   * - Pedido deve existir e estar entregue (DELIVERED)
   * - Pedido deve pertencer ao usuário
   * - Usuário só pode avaliar uma vez por pedido
   */
  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { orderId, rating, comment } = createReviewDto;

    // Verificar se o pedido existe
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Verificar se o pedido pertence ao usuário
    if (order.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para avaliar este pedido',
      );
    }

    // Verificar se o pedido foi entregue
    if (order.status !== 'DELIVERED') {
      throw new BadRequestException(
        'Você só pode avaliar pedidos que foram entregues',
      );
    }

    // Verificar se já existe uma avaliação para este pedido
    const existingReview = await this.prisma.review.findUnique({
      where: { orderId },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Você já avaliou este pedido. Use a opção de atualizar avaliação.',
      );
    }

    // Criar a avaliação
    const review = await this.prisma.review.create({
      data: {
        orderId,
        userId,
        restaurantId: order.restaurantId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    // Recalcular média de avaliações do restaurante
    await this.updateRestaurantRating(order.restaurantId);

    this.logger.log(
      `Avaliação criada para pedido ${orderId} pelo usuário ${userId}`,
    );

    return {
      message: 'Avaliação criada com sucesso',
      review,
    };
  }

  /**
   * Lista avaliações de um restaurante
   */
  async findByRestaurant(restaurantId: string) {
    // Verificar se o restaurante existe
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    const reviews = await this.prisma.review.findMany({
      where: { restaurantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews;
  }

  /**
   * Busca uma avaliação específica
   */
  async findOne(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Verificar ownership
    if (review.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta avaliação',
      );
    }

    return review;
  }

  /**
   * Atualiza uma avaliação
   * Apenas o autor pode atualizar
   */
  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto) {
    // Verificar se a avaliação existe e pertence ao usuário
    const review = await this.findOne(id, userId);

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Recalcular média se a nota foi alterada
    if (updateReviewDto.rating !== undefined) {
      await this.updateRestaurantRating(review.restaurantId);
    }

    this.logger.log(`Avaliação ${id} atualizada pelo usuário ${userId}`);

    return {
      message: 'Avaliação atualizada com sucesso',
      review: updatedReview,
    };
  }

  /**
   * Remove uma avaliação
   * Apenas o autor pode remover
   */
  async remove(id: string, userId: string) {
    // Verificar se a avaliação existe e pertence ao usuário
    const review = await this.findOne(id, userId);

    await this.prisma.review.delete({
      where: { id },
    });

    // Recalcular média do restaurante
    await this.updateRestaurantRating(review.restaurantId);

    this.logger.log(`Avaliação ${id} removida pelo usuário ${userId}`);

    return {
      message: 'Avaliação removida com sucesso',
    };
  }

  /**
   * Recalcula a média de avaliações de um restaurante
   */
  private async updateRestaurantRating(restaurantId: string) {
    const result = await this.prisma.review.aggregate({
      where: { restaurantId },
      _avg: {
        rating: true,
      },
      _count: true,
    });

    const averageRating = result._avg.rating || 0;

    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Arredondar para 1 casa decimal
      },
    });

    this.logger.log(
      `Rating do restaurante ${restaurantId} atualizado: ${averageRating.toFixed(1)} (${result._count} avaliações)`,
    );
  }
}
