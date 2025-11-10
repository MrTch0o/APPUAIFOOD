import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Adiciona um produto ao carrinho do usuário
   * Se o produto já existe no carrinho, incrementa a quantidade
   */
  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity = 1 } = addToCartDto;

    // Verificar se o produto existe e está disponível
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { restaurant: true },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (!product.available) {
      throw new BadRequestException('Produto indisponível no momento');
    }

    if (!product.restaurant.isActive) {
      throw new BadRequestException('Restaurante indisponível no momento');
    }

    // Verificar se o carrinho já tem produtos de outro restaurante
    const existingCartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: { restaurantId: true },
        },
      },
    });

    if (existingCartItems.length > 0) {
      const firstRestaurantId = existingCartItems[0].product.restaurantId;
      if (firstRestaurantId !== product.restaurantId) {
        throw new BadRequestException(
          'Você só pode adicionar produtos do mesmo restaurante. Limpe o carrinho para adicionar produtos de outro restaurante.',
        );
      }
    }

    // Verificar se já existe no carrinho
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingCartItem) {
      // Atualizar quantidade
      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                  deliveryFee: true,
                  deliveryTime: true,
                  minimumOrder: true,
                },
              },
            },
          },
        },
      });
    }

    // Criar novo item no carrinho
    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                deliveryFee: true,
                deliveryTime: true,
                minimumOrder: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Retorna o carrinho completo do usuário com cálculos
   */
  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                deliveryFee: true,
                deliveryTime: true,
                minimumOrder: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calcular totais
    let subtotal = 0;
    let deliveryFee = 0;
    let restaurantId: string | null = null;
    let restaurantName = '';
    let minimumOrder = 0;

    if (cartItems.length > 0) {
      // Assumir que todos os itens são do mesmo restaurante
      const firstItem = cartItems[0];
      restaurantId = firstItem.product.restaurant.id;
      restaurantName = firstItem.product.restaurant.name;
      deliveryFee = firstItem.product.restaurant.deliveryFee;
      minimumOrder = firstItem.product.restaurant.minimumOrder || 0;

      // Calcular subtotal
      subtotal = cartItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);
    }

    const total = subtotal + deliveryFee;
    const meetsMinimumOrder = subtotal >= minimumOrder;

    return {
      items: cartItems,
      summary: {
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        deliveryFee,
        total,
        restaurantId,
        restaurantName,
        minimumOrder,
        meetsMinimumOrder,
      },
    };
  }

  /**
   * Atualiza a quantidade de um item no carrinho
   */
  async updateCartItem(
    userId: string,
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    if (cartItem.userId !== userId) {
      throw new BadRequestException('Este item não pertence ao seu carrinho');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: updateCartItemDto.quantity,
      },
      include: {
        product: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                deliveryFee: true,
                deliveryTime: true,
                minimumOrder: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Remove um item do carrinho
   */
  async removeCartItem(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    if (cartItem.userId !== userId) {
      throw new BadRequestException('Este item não pertence ao seu carrinho');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return { message: 'Item removido do carrinho com sucesso' };
  }

  /**
   * Limpa todo o carrinho do usuário
   */
  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: 'Carrinho limpo com sucesso' };
  }
}
