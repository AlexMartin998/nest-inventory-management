import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from './product.entity';

@Entity()
export class ProductMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unit: string;

  @ManyToOne(() => Product, (product) => product.productMeasurements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
