import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { name: 'last_name' })
  lastName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('bool', { name: 'is_active', default: true })
  isActive: boolean;

  // relations
  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
