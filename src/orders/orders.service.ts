import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

import { UsersService } from '../users/users.service';
import { AddressesService } from '../addresses/addresses.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto, PaginatedOrders, UpdateOrderDto } from './dto';
import { PaginationDto } from '../common/dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly usersService: UsersService,
    private readonly addressesService: AddressesService,
    private readonly productsService: ProductsService,

    // query runner
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const { address_id, items } = createOrderDto;

    const [user, address] = await Promise.all([
      this.usersService.findOne(userId),
      this.addressesService.findOne(address_id),
    ]);

    const order = this.orderRepository.create({
      ...createOrderDto,
      user,
      address,
      date: new Date(),
      totalAmount: 0,
      items: [],
    });

    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const orderItemPromises = items.map(async (item: any) => {
          const product = await this.productsService.findOne(
            item.product_id,
            userId,
          );

          if (product.price !== item.price)
            throw new UnauthorizedException('Prices do not match!');

          const orderItem = this.orderItemRepository.create({
            quantity: item.quantity,
            price: item.price,
            order,
            product,
          });
          delete orderItem.order;
          order.items.push(orderItem);

          order.totalAmount += orderItem.price * orderItem.quantity;

          await queryRunner.manager.save(orderItem);
          return orderItem;
        });

        const orderItems = await Promise.all(orderItemPromises);
        order.items = orderItems;

        await queryRunner.manager.save(order);

        await queryRunner.commitTransaction();

        return order;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedOrders> {
    const { limit, offset } = paginationDto;

    const [products, count] = await Promise.all([
      this.orderRepository.find({
        take: limit,
        skip: offset,
      }),
      this.orderRepository.count(),
    ]);

    return { count, products };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order with id: '${id}' not found`);

    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private handleDBErrors(error: any): never {
    if (+error.status === 404 || +error.status === 401) throw error;

    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'err-001') throw new NotFoundException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
