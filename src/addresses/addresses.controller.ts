import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Auth, GetUser } from '../auth/decorators';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { ValidRoles } from './../auth/interfaces';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Auth(ValidRoles.user, ValidRoles.admin)
  @Post()
  create(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser('id') userId: number,
  ) {
    return this.addressesService.create(createAddressDto, userId);
  }

  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(+id);
  }
}
