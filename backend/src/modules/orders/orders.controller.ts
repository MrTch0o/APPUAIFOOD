import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { UserRole, OrderStatus } from '@prisma/client';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Criar pedido a partir do carrinho ou com itens especificados',
  })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Carrinho vazio ou validação falhou',
  })
  @ApiResponse({
    status: 404,
    description: 'Endereço ou produto não encontrado',
  })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(user.sub, createOrderDto);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar pedidos do usuário' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiResponse({ status: 200, description: 'Lista de pedidos retornada' })
  findUserOrders(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findUserOrders(user.sub, status);
  }

  @Get('restaurant/:restaurantId')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar pedidos de um restaurante (OWNER/ADMIN)' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiResponse({ status: 200, description: 'Lista de pedidos do restaurante' })
  findRestaurantOrders(
    @Param('restaurantId') restaurantId: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findRestaurantOrders(restaurantId, status);
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Obter detalhes de um pedido' })
  @ApiResponse({ status: 200, description: 'Detalhes do pedido' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para ver este pedido',
  })
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.ordersService.findOne(user.sub, id, user.role);
  }

  @Patch(':id/status')
  @Roles(UserRole.CLIENT, UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Atualizar status do pedido',
    description:
      'CLIENT pode cancelar (PENDING → CANCELLED). OWNER/ADMIN podem avançar status (PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED)',
  })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      user.sub,
      id,
      updateOrderStatusDto,
      user.role,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deletar pedido (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Pedido removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
