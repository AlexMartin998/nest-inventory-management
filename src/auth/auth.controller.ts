import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @Auth(ValidRoles.admin)
  someMethod() {
    return 'Ok';
  }
}
