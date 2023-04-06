import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

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
}
