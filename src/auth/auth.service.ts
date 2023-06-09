import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto, AuthResponse, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signupDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create(signupDto);

    const token = this.getJwt(user.id);

    return { token, user };
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException([
        'There was a problem logging in. Check your email and password or create an account',
      ]);
    delete user.password;

    const token = this.getJwt(user.id);

    return { token, user };
  }

  async findRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException([`Role with id '${id}' not found`]);

    return role;
  }

  checkAuthStatus(user: User): AuthResponse {
    return { user, token: this.getJwt(user.id) };
  }

  private getJwt(id: number) {
    const token = this.jwtService.sign({ id });
    return token;
  }
}
