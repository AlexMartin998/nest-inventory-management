import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Address } from '../../addresses/entities/address.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column('text', { name: 'payment_type' })
  paymentType: string;

  @Column('int', { name: 'total_amount' })
  totalAmount: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  items: OrderItem[];

  @ManyToOne(() => Address, (address) => address.orders)
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
