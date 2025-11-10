import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Casa', description: 'Identificação do endereço' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label: string;

  @ApiProperty({ example: 'Rua das Flores', description: 'Nome da rua' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  street: string;

  @ApiProperty({ example: '123', description: 'Número do endereço' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  number: string;

  @ApiProperty({
    example: 'Apto 101',
    description: 'Complemento (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  complement?: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  neighborhood: string;

  @ApiProperty({ example: 'Belo Horizonte', description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    example: 'MG',
    description: 'Estado (UF com 2 letras maiúsculas)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/, {
    message: 'UF deve conter exatamente 2 letras maiúsculas',
  })
  state: string;

  @ApiProperty({
    example: '30110-000',
    description: 'CEP (formato: 00000-000 ou 00000000)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP deve estar no formato 00000-000 ou 00000000',
  })
  zipCode: string;

  @ApiProperty({
    example: false,
    description: 'Define se é o endereço padrão',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
