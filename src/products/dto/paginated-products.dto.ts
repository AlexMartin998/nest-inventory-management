import { Product } from '../entities/product.entity';

export class PaginatedProducts {
  count: number;
  products: Product[];
}
