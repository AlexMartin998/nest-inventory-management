import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

import { OrderItem } from '../entities/order-item.entity';

export class CreateOrderDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  paymentType: string;

  @IsNumber()
  @IsPositive()
  address_id: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'items should not be empty' })
  items: OrderItem[];
}
