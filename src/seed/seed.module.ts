import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],

  imports: [AuthModule, UsersModule, CategoriesModule, ProductsModule],
})
export class SeedModule {}
