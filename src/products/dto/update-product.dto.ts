import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  @Min(1)
  @IsOptional()
  measurementUnitId?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantityId?: number;

  @IsBoolean()
  @IsOptional()
  hasStock?: boolean;
}
