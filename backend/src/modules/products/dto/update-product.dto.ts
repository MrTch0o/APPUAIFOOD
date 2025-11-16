import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'Disponibilidade do produto',
    example: true,
  })
  @IsBoolean({ message: 'A disponibilidade deve ser verdadeiro ou falso' })
  @IsOptional()
  available?: boolean;

  @ApiPropertyOptional({
    description: 'ID do restaurante (pode ser alterado)',
    example: 'uuid-do-restaurante',
  })
  @IsUUID('4', { message: 'restaurantId deve ser um UUID válido' })
  @IsOptional()
  restaurantId?: string;
}
