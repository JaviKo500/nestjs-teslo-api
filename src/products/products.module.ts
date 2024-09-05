import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductImageEntity, Product } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature( [ Product,ProductImageEntity ] ),
    AuthModule
  ],
  exports: [
    ProductsService
  ]
})
export class ProductsModule {}
