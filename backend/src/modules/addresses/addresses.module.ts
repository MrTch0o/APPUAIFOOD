import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, PrismaService],
  exports: [AddressesService],
})
export class AddressesModule {}
