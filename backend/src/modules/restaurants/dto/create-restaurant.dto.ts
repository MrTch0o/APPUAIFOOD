import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Nome do restaurante',
    example: 'Restaurante Mineiro',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descrição do restaurante',
    example: 'Comida mineira autêntica feita com carinho',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Endereço completo do restaurante',
    example: 'Rua das Flores, 123 - Centro',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @MaxLength(200, { message: 'O endereço deve ter no máximo 200 caracteres' })
  address: string;

  @ApiProperty({
    description: 'Telefone do restaurante',
    example: '31999999999',
  })
  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve ter 10 ou 11 dígitos (apenas números)',
  })
  phone: string;

  @ApiProperty({
    description: 'Horário de funcionamento',
    example: 'Seg-Sex: 11h-23h | Sáb-Dom: 12h-00h',
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200, {
    message: 'O horário de funcionamento deve ter no máximo 200 caracteres',
  })
  openingHours?: string;

  @ApiProperty({
    description: 'Taxa de entrega em reais',
    example: 5.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty({ message: 'A taxa de entrega é obrigatória' })
  @Min(0, { message: 'A taxa de entrega não pode ser negativa' })
  @Max(100, { message: 'A taxa de entrega não pode ser maior que R$ 100' })
  deliveryFee: number;

  @ApiProperty({
    description: 'Tempo estimado de entrega',
    example: '30-45 min',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'O tempo de entrega é obrigatório' })
  @MaxLength(50, {
    message: 'O tempo de entrega deve ter no máximo 50 caracteres',
  })
  deliveryTime: string;

  @ApiProperty({
    description: 'Categoria do restaurante',
    example: 'Mineira',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  @MaxLength(50, { message: 'A categoria deve ter no máximo 50 caracteres' })
  category: string;
}
