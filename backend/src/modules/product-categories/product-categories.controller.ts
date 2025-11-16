import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private categoriesService: ProductCategoriesService) {}

  /**
   * Cria uma nova categoria de produto (admin)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova categoria de produto' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou categoria já existe',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas admin',
  })
  create(@Body() createDto: CreateProductCategoryDto) {
    return this.categoriesService.create(createDto);
  }

  /**
   * Lista todas as categorias (requer autenticação)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar categorias de produto' })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filtrar apenas categorias ativas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  findAll(@Query('active') active?: string) {
    const onlyActive = active === 'true';
    return this.categoriesService.findAll(onlyActive);
  }

  /**
   * Encontra uma categoria por ID (requer autenticação)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter categoria por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  /**
   * Atualiza uma categoria (admin)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar categoria de produto' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateProductCategoryDto) {
    return this.categoriesService.update(id, updateDto);
  }

  /**
   * Deleta uma categoria (admin)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar categoria de produto' })
  @ApiResponse({
    status: 200,
    description: 'Categoria deletada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível deletar - categoria em uso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

  /**
   * Ativa uma categoria (admin)
   */
  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ativar categoria de produto' })
  @ApiResponse({
    status: 200,
    description: 'Categoria ativada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  activate(@Param('id') id: string) {
    return this.categoriesService.activate(id);
  }

  /**
   * Desativa uma categoria (admin)
   */
  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desativar categoria de produto' })
  @ApiResponse({
    status: 200,
    description: 'Categoria desativada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível desativar - categoria em uso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  deactivate(@Param('id') id: string) {
    return this.categoriesService.deactivate(id);
  }
}
