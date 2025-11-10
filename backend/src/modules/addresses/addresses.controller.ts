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
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Endereços')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo endereço' })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.create(user.sub, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os endereços do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de endereços' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.addressesService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar endereço por ID' })
  @ApiResponse({ status: 200, description: 'Endereço encontrado' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.addressesService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar endereço' })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(id, user.sub, updateAddressDto);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Marcar endereço como padrão' })
  @ApiResponse({
    status: 200,
    description: 'Endereço marcado como padrão com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  setDefault(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.addressesService.setDefault(id, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover endereço' })
  @ApiResponse({ status: 200, description: 'Endereço removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({
    status: 400,
    description: 'Não é possível remover endereço com pedidos ativos',
  })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.addressesService.remove(id, user.sub);
  }
}
