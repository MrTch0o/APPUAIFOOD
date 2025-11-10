import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
  })
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Observações do item',
    example: 'Sem cebola',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID do endereço de entrega',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  addressId: string;

  @ApiProperty({
    description: 'Método de pagamento',
    example: 'Cartão de Crédito',
    enum: ['Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Pix'],
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'Observações gerais do pedido',
    example: 'Entregar na portaria',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Itens do pedido',
    type: [CreateOrderItemDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsOptional()
  items?: CreateOrderItemDto[];
}
