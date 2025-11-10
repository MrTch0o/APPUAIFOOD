import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
  @ApiResponse({ status: 201, description: 'Produto adicionado ao carrinho' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({
    status: 400,
    description: 'Produto ou restaurante indisponível',
  })
  addToCart(
    @CurrentUser() user: JwtPayload,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(user.sub, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obter carrinho do usuário' })
  @ApiResponse({ status: 200, description: 'Carrinho retornado com sucesso' })
  getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.sub);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Atualizar quantidade de item no carrinho' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  updateCartItem(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(user.sub, id, updateCartItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  removeCartItem(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.cartService.removeCartItem(user.sub, id);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpar todo o carrinho' })
  @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
  clearCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.clearCart(user.sub);
  }
}
