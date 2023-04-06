import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from '../../orders/entities/order.entity';
import { User } from './../../users/entities/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  street: string;

  @Column('text')
  city: string;

  @Column('text')
  country: string;

  @Column('text', { name: 'zip_code' })
  zipCode: string;

  @Column('text')
  phone: string;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];
}
