import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

// Omit restaurantId (não pode ser alterado)
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['restaurantId'] as const),
) {
  @ApiPropertyOptional({
    description: 'Disponibilidade do produto',
    example: true,
  })
  @IsBoolean({ message: 'A disponibilidade deve ser verdadeiro ou falso' })
  @IsOptional()
  available?: boolean;
}
