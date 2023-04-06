import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { ProductMeasurement } from './entities/product-measurement.entity';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { StockInquiry } from './entities/stock-inquiries.entity';
import { ProductChangeHistory } from './entities/product-change-history.entity';

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
  ],
})
export class ProductsModule {}
