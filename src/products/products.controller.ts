import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ValidRoles } from '../auth/interfaces';
import { PaginationDto } from '../common/dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Auth(ValidRoles.admin)
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser('id') userId: number,
  ) {
    return this.productsService.findAll(paginationDto, userId);
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.productsService.findOne(id, userId);
  }

  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser('id') userId: number,
  ) {
    return this.productsService.update(id, updateProductDto, userId);
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
