import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { ProductMeasurement } from './product-measurement.entity';
import { StockInquiry } from './stock-inquiries.entity';
import { ProductChangeHistory } from './product-change-history.entity';
import { createRandomSku } from '../../common/utils';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Porduct ID',
    uniqueItems: true,
  })
  id: number;

  @Column('text', { unique: true })
  @ApiProperty()
  sku: string;

  @Column('text', { unique: true })
  @ApiProperty()
  title: string;

  @Column('bool', { name: 'has_stock', default: true })
  @ApiProperty()
  hasStock: boolean;

  @Column('float', { default: 0 })
  @ApiProperty()
  price: number;

  // relations
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: () => User })
  user: User;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  @ApiProperty()
  category: Category;

  @OneToMany(
    () => ProductMeasurement,
    (productMeasurement) => productMeasurement.product,
    { eager: true, cascade: true },
  )
  @ApiProperty({ type: () => [ProductMeasurement] })
  productMeasurements: ProductMeasurement[];

  @OneToMany(() => StockInquiry, (stockInquiry) => stockInquiry.product, {
    eager: true,
    cascade: true,
  })
  @ApiProperty({ type: () => [StockInquiry] })
  stockInquiries: StockInquiry[];

  @OneToMany(
    () => ProductChangeHistory,
    (changeHistory) => changeHistory.product,
    { eager: true, cascade: true },
  )
  @ApiProperty({ type: () => [ProductChangeHistory] })
  changeHistory: ProductChangeHistory[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @BeforeInsert()
  addProductCode() {
    if (!this.sku) this.sku = createRandomSku(this.category.name);
  }

  @BeforeUpdate()
  updateProductCode() {
    this.addProductCode();
  }
}
