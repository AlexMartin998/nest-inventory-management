import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Role } from '../auth/entities/role.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';
import { SEED_CATEGORIES, SEED_ROLES, SEED_USERS } from './data';

@Injectable()
export class SeedService {
  private isDev: boolean;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly productsService: ProductsService,
  ) {
    this.isDev =
      configService.get<string>('stage') === 'dev' &&
      configService.get<string>('nodeEnv') === 'dev';
  }

  async executeSeed() {
    if (!this.isDev)
      throw new UnauthorizedException('Cannot run SEED in Production');

    await this.deleteData();

    await this.insertRoles();
    const [admin] = await this.insertUsers();
    await this.insertCategories();

    return { message: 'Seed executed' };
  }

  private async deleteData() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const allTables = [
      'category',
      'product_change_history',
      'product_measurement',
      'products',
      'stock_inquiry',
      'user_roles',
      'roles',
      'users',
    ];
    const promisesArr = [];

    await queryRunner.startTransaction();

    try {
      allTables.forEach(async (tableName) => {
        if (tableName.includes('role')) return;

        promisesArr.push(
          queryRunner.query(`TRUNCATE TABLE ${tableName} CASCADE`),
        );
        promisesArr.push(
          queryRunner.query(
            `ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1`,
          ),
        );
      });

      await Promise.all(promisesArr);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async insertRoles(): Promise<Role[]> {
    const roles: Role[] = [];

    SEED_ROLES.forEach((role) => roles.push(this.roleRepository.create(role)));

    return this.roleRepository.save(roles);
  }

  private async insertUsers(): Promise<User[]> {
    const users: User[] = [];

    SEED_USERS.forEach((user) => {
      user.password = bcrypt.hashSync(user.password, 10);

      users.push(this.userRepository.create(user));
    });

    return await this.userRepository.save(users);
  }

  private async insertCategories(): Promise<Category[]> {
    const categories: Category[] = [];

    SEED_CATEGORIES.forEach((cat) =>
      categories.push(this.categoryRepository.create(cat)),
    );

    return await this.categoryRepository.save(categories);
  }
}
