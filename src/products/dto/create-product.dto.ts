import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 3,
  })
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsNumber()
  @IsPositive()
  category_id: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  code?: string;
}
