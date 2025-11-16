import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário',
    example: '31999999999',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve ter 10 ou 11 dígitos (apenas números)',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Nova senha (mínimo 6 caracteres)',
    example: 'NovaSenha@123',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password?: string;
}
