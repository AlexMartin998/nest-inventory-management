import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Role } from '../auth/entities/role.entity';
import { User } from './entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(signupInput: CreateUserDto): Promise<User> {
    try {
      let user = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      const role = await this.roleRepository.findOneBy({
        id: signupInput.role_id ?? 2,
      });
      if (!role)
        throw new NotFoundException([
          `Role with id '${signupInput.role_id}' not found`,
        ]);

      user.roles = [role];

      user = await this.userRepository.save(user);
      delete user.password;
      delete user.isActive;

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: '${id}' not found`);

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email },
        select: {
          email: true,
          password: true,
          id: true,
          lastName: true,
          roles: true,
        },
      });
      return user;
    } catch (error) {
      throw new UnauthorizedException([
        'There was a problem logging in. Check your email and password or create an account',
      ]);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException([
        error.detail.replace(/Key|[\(\)\=]/g, '').trim(),
      ]);

    if (error.code === 'err-001') throw new NotFoundException(error.detail);

    console.log(error);
    throw new InternalServerErrorException(['Please check server logs']);
  }
}
