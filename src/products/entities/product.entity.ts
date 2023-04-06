import {
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

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  code: string;

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
}
