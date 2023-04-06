import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Address } from './entities/address.entity';
import { UsersService } from '../users/users.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    private readonly usersService: UsersService,

    // query runner
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<Address> {
    const user = await this.usersService.findOne(userId);

    try {
      const address = this.addressRepository.create({
        ...createAddressDto,
        user,
      });
      await this.addressRepository.save(address);

      return address;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'err-001') throw new NotFoundException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
