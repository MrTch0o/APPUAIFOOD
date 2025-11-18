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
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';
import { RestaurantCategoriesService } from './restaurant-categories.service';
import {
  CreateRestaurantCategoryDto,
  UpdateRestaurantCategoryDto,
} from './dto';

@ApiTags('Restaurant Categories')
@Controller('restaurant-categories')
export class RestaurantCategoriesController {
  constructor(private categoriesService: RestaurantCategoriesService) {}

  /**
   * Cria uma nova categoria de restaurante (admin)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova categoria de restaurante' })
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
  create(@Body() createDto: CreateRestaurantCategoryDto) {
    return this.categoriesService.create(createDto);
  }

  /**
   * Lista todas as categorias (publico - nao requer autenticacao)
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar categorias de restaurante' })
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
  findAll(@Query('active') active?: string) {
    const onlyActive = active === 'true';
    return this.categoriesService.findAll(onlyActive);
  }

  /**
   * Encontra uma categoria por ID (publico - nao requer autenticacao)
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obter categoria por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
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
  @ApiOperation({ summary: 'Atualizar categoria de restaurante' })
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
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantCategoryDto,
  ) {
    return this.categoriesService.update(id, updateDto);
  }

  /**
   * Deleta uma categoria (admin)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar categoria de restaurante' })
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
  @ApiOperation({ summary: 'Ativar categoria de restaurante' })
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
  @ApiOperation({ summary: 'Desativar categoria de restaurante' })
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
