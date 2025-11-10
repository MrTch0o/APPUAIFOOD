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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Avaliações')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova avaliação' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Pedido não entregue ou já avaliado',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Pedido não pertence ao usuário' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.sub, createReviewDto);
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Listar avaliações de um restaurante' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações' })
  @ApiResponse({ status: 404, description: 'Restaurante não encontrado' })
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.reviewsService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar avaliação por ID' })
  @ApiResponse({ status: 200, description: 'Avaliação encontrada' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reviewsService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, user.sub, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reviewsService.remove(id, user.sub);
  }
}
