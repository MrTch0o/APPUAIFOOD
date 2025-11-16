import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  Validate,
} from 'class-validator';
import { IsValidOpeningHoursConstraint } from '../validators/opening-hours.validator';

export { RestaurantCategory } from '../constants/categories';

export class UpdateRestaurantDto {
  @ApiPropertyOptional({
    description: 'Nome do restaurante',
    example: 'Restaurante Mineiro',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do restaurante',
    example: 'Comida mineira autêntica feita com carinho',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Endereço completo do restaurante',
    example: 'Rua das Flores, 123 - Centro',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'O endereço deve ter no máximo 200 caracteres' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Telefone do restaurante',
    example: '31999999999',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve ter 10 ou 11 dígitos (apenas números)',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Horário de funcionamento (objeto JSON ou string)',
    example: { seg: '11:00-23:00', ter: '11:00-23:00' },
  })
  @IsOptional()
  @Validate(IsValidOpeningHoursConstraint)
  openingHours?: Record<string, string> | string | null;

  @ApiPropertyOptional({
    description: 'Taxa de entrega em reais',
    example: 5.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0, { message: 'A taxa de entrega não pode ser negativa' })
  @Max(100, { message: 'A taxa de entrega não pode ser maior que R$ 100' })
  deliveryFee?: number;

  @ApiPropertyOptional({
    description: 'Tempo estimado de entrega',
    example: '30-45 min',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, {
    message: 'O tempo de entrega deve ter no máximo 50 caracteres',
  })
  deliveryTime?: string;

  @ApiPropertyOptional({
    description: 'Valor mínimo do pedido em reais',
    example: 15.0,
    minimum: 0,
    maximum: 1000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0, { message: 'O pedido mínimo não pode ser negativo' })
  @Max(1000, { message: 'O pedido mínimo não pode ser maior que R$ 1000' })
  minimumOrder?: number;

  @ApiPropertyOptional({
    description: 'Status de ativação do restaurante',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
