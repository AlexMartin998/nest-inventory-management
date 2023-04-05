import { Injectable } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(signupDto: RegisterDto): Promise<any> {
    const user = await this.usersService.create(signupDto);

    // const token = this.getJwt(user.id);

    return { user };
  }
}
