import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, PrismaService],
  exports: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
