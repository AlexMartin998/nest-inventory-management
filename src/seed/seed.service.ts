import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Category } from '../categories/entities/category.entity';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  private isDev: boolean;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,

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

    // const [user] = await this.insertUsers();
    // await this.insertCategories();
    // await this.insertProucts(user);

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
}
