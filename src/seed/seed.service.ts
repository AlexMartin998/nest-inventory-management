import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Role } from '../auth/entities/role.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_ROLES, SEED_USERS } from './data';
import { UsersService } from '../users/users.service';

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
    private readonly usersService: UsersService,
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
    await this.insertProucts(admin);

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

  private async insertUsers(): Promise<any[]> {
    const insertPromises = SEED_USERS.map((user) =>
      this.usersService.create(user),
    );
    const usersArr = [];

    for await (const user of insertPromises) {
      usersArr.push(user);
    }

    return usersArr;
  }

  private async insertCategories(): Promise<Category[]> {
    const categories: Category[] = [];

    SEED_CATEGORIES.forEach((cat) =>
      categories.push(this.categoryRepository.create(cat)),
    );

    return await this.categoryRepository.save(categories);
  }

  private async insertProucts(user: User) {
    const insertPromises = [];

    SEED_PRODUCTS.forEach((product) =>
      insertPromises.push(this.productsService.create(product, user)),
    );

    await Promise.all(insertPromises);

    return true;
  }
}
