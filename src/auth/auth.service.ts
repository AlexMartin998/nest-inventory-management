import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly usersService: UsersService,
  ) {}

  async register(signupDto: RegisterDto): Promise<any> {
    const user = await this.usersService.create(signupDto);

    // const token = this.getJwt(user.id);

    return { user };
  }

  async findRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException([`Role with id '${id}' not found`]);

    return role;
  }
}
