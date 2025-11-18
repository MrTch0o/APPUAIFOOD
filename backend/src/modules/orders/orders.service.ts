import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrderStatus, UserRole } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Cria um pedido a partir do carrinho do usuário ou de itens fornecidos
   */
  async create(userId: string, createOrderDto: CreateOrderDto) {
    const {
      addressId,
      paymentMethod,
      notes,
      items: providedItems,
    } = createOrderDto;

    // Verificar se o endereço existe e pertence ao usuário
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Este endereço não pertence a você');
    }

    // Buscar itens do carrinho (se não foram fornecidos itens)
    let orderItems = providedItems;

    if (!orderItems || orderItems.length === 0) {
      const cartItems = await this.prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new BadRequestException(
          'Carrinho vazio. Adicione produtos antes de fazer o pedido',
        );
      }

      orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: undefined,
      }));
    }

    // Buscar todos os produtos
    const productIds = orderItems.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { restaurant: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'Um ou mais produtos não foram encontrados',
      );
    }

    // Validar disponibilidade dos produtos
    for (const product of products) {
      if (!product.available) {
        throw new BadRequestException(
          `O produto "${product.name}" está indisponível`,
        );
      }
      if (!product.restaurant.isActive) {
        throw new BadRequestException(
          `O restaurante "${product.restaurant.name}" está indisponível`,
        );
      }
    }

    // Validar que todos os produtos são do mesmo restaurante
    const restaurantIds = [...new Set(products.map((p) => p.restaurantId))];
    if (restaurantIds.length > 1) {
      throw new BadRequestException(
        'Todos os produtos devem ser do mesmo restaurante',
      );
    }

    const restaurantId = restaurantIds[0];
    const restaurant = products[0].restaurant;

    // Calcular subtotal e preparar itens do pedido
    let subtotal = 0;
    const orderItemsData = orderItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new BadRequestException(
          `Produto ${item.productId} não encontrado`,
        );
      }

      const quantity = item.quantity || 1;
      const price = product.price;
      const itemSubtotal = price * quantity;

      subtotal += itemSubtotal;

      return {
        productId: item.productId,
        quantity,
        price,
        subtotal: itemSubtotal,
        notes: item.notes,
      };
    });

    // Validar pedido mínimo
    if (restaurant.minimumOrder && subtotal < restaurant.minimumOrder) {
      throw new BadRequestException(
        `Pedido mínimo de R$ ${restaurant.minimumOrder.toFixed(2)}. Seu pedido: R$ ${subtotal.toFixed(2)}`,
      );
    }

    const deliveryFee = restaurant.deliveryFee;
    const total = subtotal + deliveryFee;

    // Criar pedido COM isPaid: true (simular pagamento confirmado)
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId,
        addressId,
        status: OrderStatus.PENDING,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        notes,
        isPaid: true, // Simular pagamento confirmado
        paymentVerifiedAt: new Date(), // Registrar quando foi "pago"
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            phone: true,
            deliveryTime: true,
          },
        },
      },
    });

    // Limpar carrinho após criar pedido
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return order;
  }

  /**
   * Lista pedidos do usuário
   */
  async findUserOrders(userId: string, status?: OrderStatus) {
    const where = {
      userId,
      ...(status && { status }),
    };

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Lista pedidos de um restaurante (para o OWNER) - APENAS pedidos pagos
   */
  async findRestaurantOrders(restaurantId: string, status?: OrderStatus) {
    const where = {
      restaurantId,
      isPaid: true, // IMPORTANTE: Mostrar APENAS pedidos pagos ao restaurante
      ...(status && { status }),
    };

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca um pedido por ID
   */
  async findOne(userId: string, orderId: string, userRole: UserRole) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        restaurant: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Verificar permissão
    if (userRole === UserRole.CLIENT && order.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para ver este pedido',
      );
    }

    if (
      userRole === UserRole.RESTAURANT_OWNER &&
      order.restaurant.ownerId !== userId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para ver este pedido',
      );
    }

    return order;
  }

  /**
   * Atualiza o status de um pedido
   */
  async updateStatus(
    userId: string,
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    userRole: UserRole,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        restaurant: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Validar permissões
    if (userRole === UserRole.CLIENT) {
      // Cliente só pode cancelar pedidos PENDING
      if (updateOrderStatusDto.status !== OrderStatus.CANCELLED) {
        throw new ForbiddenException('Você só pode cancelar pedidos');
      }
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException(
          'Só é possível cancelar pedidos pendentes',
        );
      }
      if (order.userId !== userId) {
        throw new ForbiddenException('Este pedido não pertence a você');
      }
    }

    if (userRole === UserRole.RESTAURANT_OWNER) {
      if (order.restaurant.ownerId !== userId) {
        throw new ForbiddenException(
          'Este pedido não pertence ao seu restaurante',
        );
      }
    }

    // Validar transição de status
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      PREPARING: [OrderStatus.OUT_FOR_DELIVERY],
      OUT_FOR_DELIVERY: [OrderStatus.DELIVERED],
      DELIVERED: [],
      CANCELLED: [],
    };

    const allowedStatuses = validTransitions[order.status];
    if (!allowedStatuses.includes(updateOrderStatusDto.status)) {
      throw new BadRequestException(
        `Não é possível mudar status de ${order.status} para ${updateOrderStatusDto.status}`,
      );
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateOrderStatusDto.status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        address: true,
      },
    });
  }

  /**
   * Deleta um pedido (apenas ADMIN)
   */
  async remove(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    await this.prisma.order.delete({
      where: { id: orderId },
    });

    return { message: 'Pedido removido com sucesso' };
  }
}
