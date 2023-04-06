import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAddressDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty()
  street: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty()
  zipCode: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty()
  phone: string;
}
