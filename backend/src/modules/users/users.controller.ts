import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Ver perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.findOne(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.sub, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar conta do usuário logado' })
  @ApiResponse({ status: 200, description: 'Conta deletada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  removeMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.remove(user.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada' })
  @ApiResponse({ status: 403, description: 'Acesso negado - requer ADMIN' })
  findAll() {
    return this.usersService.findAll();
  }
}
