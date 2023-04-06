import { Order } from '../entities/order.entity';

export class PaginatedOrders {
  count: number;
  products: Order[];
}
