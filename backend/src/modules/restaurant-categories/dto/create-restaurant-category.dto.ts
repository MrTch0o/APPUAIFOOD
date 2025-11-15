import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateRestaurantCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Pizzaria',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Restaurantes especializados em pizzas',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Ícone da categoria (Material Icons)',
    example: 'local_pizza',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'O ícone deve ter no máximo 50 caracteres' })
  icon?: string;

  @ApiProperty({
    description: 'Se a categoria está ativa',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
