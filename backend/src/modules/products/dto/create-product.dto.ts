import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Feijão Tropeiro',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Feijão tropeiro com torresmo, linguiça e ovo',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Preço do produto em reais',
    example: 25.9,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty({ message: 'O preço é obrigatório' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  price: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'Pratos Principais',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @MaxLength(50, { message: 'A categoria deve ter no máximo 50 caracteres' })
  category: string;

  @ApiProperty({
    description: 'ID do restaurante',
    example: 'uuid-do-restaurante',
  })
  @IsUUID('4', { message: 'ID do restaurante inválido' })
  @IsNotEmpty({ message: 'O ID do restaurante é obrigatório' })
  restaurantId: string;

  @ApiProperty({
    description: 'Tempo de preparo em minutos',
    example: 30,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'O tempo de preparo não pode ser negativo' })
  preparationTime?: number;
}
