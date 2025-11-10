import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
