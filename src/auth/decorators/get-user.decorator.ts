import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import { GetAuthUserDto } from '../dto/get-auth-user.dto';

export const GetUser = createParamDecorator(
  (data: keyof GetAuthUserDto, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new InternalServerErrorException('User not found');

    return !data ? user : user[data];
  },
);
