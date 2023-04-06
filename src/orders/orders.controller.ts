import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ValidRoles } from '../auth/interfaces';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Auth(ValidRoles.user, ValidRoles.admin)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: number,
  ) {
    return this.ordersService.create(createOrderDto, userId);
  }

  @Auth(ValidRoles.delivery, ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @Auth(ValidRoles.delivery, ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
