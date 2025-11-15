import { Module } from '@nestjs/common';
import { RestaurantCategoriesService } from './restaurant-categories.service';
import { RestaurantCategoriesController } from './restaurant-categories.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [RestaurantCategoriesController],
  providers: [RestaurantCategoriesService, PrismaService],
  exports: [RestaurantCategoriesService],
})
export class RestaurantCategoriesModule {}
