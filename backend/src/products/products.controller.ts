import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config/multer.config';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Produtos')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo produto (ADMIN ou OWNER)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar produtos disponíveis' })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
    description: 'Filtrar por ID do restaurante',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar por categoria',
  })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada' })
  findAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll(restaurantId, category);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto (ADMIN ou OWNER)' })
  @ApiResponse({ status: 200, description: 'Produto atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar produto (ADMIN ou OWNER)' })
  @ApiResponse({ status: 200, description: 'Produto deletado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/image')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de imagem do produto (ADMIN ou OWNER)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Imagem do produto (JPEG, PNG, GIF, WEBP - max 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const imageUrl = `/uploads/${file.filename}`;
    return this.productsService.updateImage(id, imageUrl);
  }
}
