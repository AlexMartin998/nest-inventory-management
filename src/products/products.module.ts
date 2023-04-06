import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

import { ProductChangeHistory } from './entities/product-change-history.entity';
import { ProductMeasurement } from './entities/product-measurement.entity';
import { Product } from './entities/product.entity';
import { StockInquiry } from './entities/stock-inquiries.entity';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductMeasurement,
      StockInquiry,
      ProductChangeHistory,
    ]),

    AuthModule,
    CategoriesModule,
  ],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
