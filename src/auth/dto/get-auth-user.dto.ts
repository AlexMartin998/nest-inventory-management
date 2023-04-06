import { PartialType } from '@nestjs/mapped-types';

import { RegisterDto } from './register.dto';

export class GetAuthUserDto extends PartialType(RegisterDto) {
  public id: number;
}
