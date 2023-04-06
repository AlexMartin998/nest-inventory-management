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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User } from '../users/entities/user.entity';
import { Product } from './entities/product.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiDocumentation } from './../common/decorators';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from '../common/dto';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiDocumentation(
    { status: 201, description: 'Product successfully created', type: Product },
    { status: 400, description: 'Bad Request' },
    { status: 401, description: 'Unauthorized' },
    { status: 500, description: 'Internal server error' },
    {
      status: 403,
      description: 'Forbidden. Does not have the necessary permits',
    },
  )
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
  remove(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.productsService.remove(id, userId);
  }
}
