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
    uniqueItems: true,
  })
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  price: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  category_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Product measurement',
    nullable: false,
    example: 'units',
  })
  unit: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Stock inquiries',
    nullable: false,
    example: 'units',
  })
  quantity: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ nullable: true })
  sku?: string;
}
