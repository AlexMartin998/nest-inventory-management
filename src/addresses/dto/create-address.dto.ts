import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateAddressDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  street: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  city: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  country: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  phone: string;
}
