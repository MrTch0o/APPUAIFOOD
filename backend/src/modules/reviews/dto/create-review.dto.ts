import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do pedido avaliado',
  })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    example: 5,
    description: 'Nota da avaliação (1-5 estrelas)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1, { message: 'A nota mínima é 1 estrela' })
  @Max(5, { message: 'A nota máxima é 5 estrelas' })
  rating: number;

  @ApiProperty({
    example: 'Comida excelente e entrega rápida!',
    description: 'Comentário sobre o pedido (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: 'O comentário não pode ter mais de 500 caracteres',
  })
  comment?: string;
}
