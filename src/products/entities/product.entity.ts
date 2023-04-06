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

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  sku: string;

  @Column('text', { unique: true })
  title: string;

  @Column('bool', { name: 'has_stock', default: true })
  hasStock: boolean;

  @Column('float', { default: 0 })
  price: number;

  // relations
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(
    () => ProductMeasurement,
    (productMeasurement) => productMeasurement.product,
    { eager: true, cascade: true },
  )
  productMeasurements: ProductMeasurement[];

  @OneToMany(() => StockInquiry, (stockInquiry) => stockInquiry.product, {
    eager: true,
    cascade: true,
  })
  stockInquiries: StockInquiry[];

  @OneToMany(
    () => ProductChangeHistory,
    (changeHistory) => changeHistory.product,
    { eager: true, cascade: true },
  )
  changeHistory: ProductChangeHistory[];

  @BeforeInsert()
  addProductCode() {
    if (!this.sku) this.sku = createRandomSku(this.category.name);
  }

  @BeforeUpdate()
  updateProductCode() {
    this.addProductCode();
  }
}
