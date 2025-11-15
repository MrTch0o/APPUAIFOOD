import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export { RestaurantCategory } from '../constants/categories';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiPropertyOptional({
    description: 'Status de ativação do restaurante',
    example: true,
  })
  @IsBoolean({ message: 'O status deve ser verdadeiro ou falso' })
  @IsOptional()
  isActive?: boolean;
}
