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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../common/config/multer.config';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Restaurantes')
@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo restaurante (apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Restaurante criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado - requer ADMIN' })
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.restaurantsService.create(createRestaurantDto, user.sub);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos os restaurantes ativos' })
  @ApiResponse({ status: 200, description: 'Lista de restaurantes retornada' })
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um restaurante' })
  @ApiResponse({ status: 200, description: 'Restaurante encontrado' })
  @ApiResponse({ status: 404, description: 'Restaurante não encontrado' })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar restaurante (ADMIN ou OWNER do restaurante)',
  })
  @ApiResponse({ status: 200, description: 'Restaurante atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Restaurante não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar restaurante (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Restaurante deletado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - requer ADMIN' })
  @ApiResponse({ status: 404, description: 'Restaurante não encontrado' })
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }

  @Post(':id/image')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload de imagem do restaurante (ADMIN ou OWNER)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Imagem do restaurante (JPEG, PNG, GIF, WEBP - max 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  @ApiResponse({ status: 404, description: 'Restaurante não encontrado' })
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const imageUrl = `/uploads/${file.filename}`;
    return this.restaurantsService.updateImage(id, imageUrl);
  }
}
