import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { OrderItem } from '../entities/order-item.entity';

export class CreateOrderDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty()
  paymentType: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  address_id: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'items should not be empty' })
  @ApiProperty({ type: [OrderItem] })
  items: OrderItem[];
}
