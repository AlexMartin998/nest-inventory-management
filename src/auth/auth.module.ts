import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from './entities/role.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, TypeOrmModule.forFeature([Role])],
})
export class AuthModule {}
