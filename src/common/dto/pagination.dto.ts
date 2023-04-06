import { IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { PAGINATION } from '../utils';

export class PaginationDto {
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ nullable: true })
  limit?: number = PAGINATION.limit;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ nullable: true })
  offset?: number = PAGINATION.offset;
}
