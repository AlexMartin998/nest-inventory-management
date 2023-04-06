import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { AddressesModule } from '../addresses/addresses.module';
import { ProductsModule } from '../products/products.module';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    AuthModule,
    UsersModule,
    AddressesModule,
    ProductsModule,
  ],
  exports: [TypeOrmModule, OrdersService],
})
export class OrdersModule {}
