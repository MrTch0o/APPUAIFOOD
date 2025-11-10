import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Novo status do pedido',
    enum: OrderStatus,
    example: 'CONFIRMED',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
