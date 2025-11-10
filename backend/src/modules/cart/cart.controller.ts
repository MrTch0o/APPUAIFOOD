import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
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
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.sub, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obter carrinho do usuário' })
  @ApiResponse({ status: 200, description: 'Carrinho retornado com sucesso' })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.sub);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Atualizar quantidade de item no carrinho' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  updateCartItem(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.sub, id, updateCartItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  removeCartItem(@Request() req, @Param('id') id: string) {
    return this.cartService.removeCartItem(req.user.sub, id);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpar todo o carrinho' })
  @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.sub);
  }
}
