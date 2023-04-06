import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { ProductChangeHistory } from './entities/product-change-history.entity';
import { ProductMeasurement } from './entities/product-measurement.entity';
import { Product } from './entities/product.entity';
import { StockInquiry } from './entities/stock-inquiries.entity';

import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto, PaginatedProducts, UpdateProductDto } from './dto';
import { PaginationDto } from '../common/dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductMeasurement)
    private readonly productMeasurementRepository: Repository<ProductMeasurement>,

    @InjectRepository(StockInquiry)
    private readonly stockInquiryRepository: Repository<StockInquiry>,

    @InjectRepository(ProductChangeHistory)
    private readonly productChangeRepository: Repository<ProductChangeHistory>,

    private readonly categoriesService: CategoriesService,

    // query runner
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const { category_id, unit, quantity } = createProductDto;

    const category = await this.categoriesService.findOne(category_id);

    try {
      const product = this.productRepository.create({
        ...createProductDto,
        category,
        user,
      });
      await this.productRepository.save(product);

      const productMeasurements = this.productMeasurementRepository.create({
        product,
        unit,
      });

      const stockInquiry = this.stockInquiryRepository.create({
        quantity,
        product,
      });

      await Promise.all([
        this.productMeasurementRepository.save(productMeasurements),
        this.stockInquiryRepository.save(stockInquiry),
      ]);

      delete productMeasurements.product;
      delete stockInquiry.product;

      product.productMeasurements = [productMeasurements];
      product.stockInquiries = [stockInquiry];

      return product;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(
    paginationDto: PaginationDto,
    userId: number,
  ): Promise<PaginatedProducts> {
    const { limit, offset } = paginationDto;

    const [products, count] = await Promise.all([
      this.productRepository.find({
        take: limit,
        skip: offset,
        where: { user: { id: userId } },
      }),
      this.productRepository.count({ where: { user: { id: userId } } }),
    ]);

    return { count, products };
  }

  async findOne(term: string, userId: number): Promise<Product> {
    let product: Product;
    if (isFinite(+term))
      product = await this.productRepository.findOneBy({
        id: +term,
        user: { id: userId },
      });
    else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      product = await queryBuilder
        .where('UPPER(title) =:title or sku =:sku', {
          title: term.toUpperCase(),
          sku: term.toLowerCase(),
        })
        .andWhere(`"user_id" =:userId`, { userId: userId })
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.productMeasurements', 'productMeasurements')
        .leftJoinAndSelect('product.stockInquiries', 'stockInquiries')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Product with '${term}' not found`);

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number,
  ): Promise<Product> {
    const {
      measurementUnitId,
      quantityId,
      quantity,
      category_id,
      unit,
      ...rest
    } = updateProductDto;

    const product = await this.findOne(id.toString(), userId);
    const { productMeasurements, stockInquiries } = product;
    let updatedProduct = await this.productRepository.preload({
      id,
      ...rest,
    });

    // Query Runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (category_id) {
        const category = await this.categoriesService.findOne(category_id);
        updatedProduct.category = category;
      }

      if (measurementUnitId && unit) {
        const measurementUnit = await this.updateMeasurementUnit(
          measurementUnitId,
          unit,
          productMeasurements,
        );
        updatedProduct.productMeasurements = [measurementUnit];
      }

      if (quantityId && quantity) {
        const stockInquiry = await this.updateStockInquiry(
          quantityId,
          quantity,
          stockInquiries,
        );
        updatedProduct.stockInquiries = [stockInquiry];
      }

      // create history
      const changeHistory = await this.createChangeHistory(
        product,
        JSON.parse(JSON.stringify(updatedProduct)),
      );

      // thanks to the catch you don't need manager.save()
      updatedProduct = await this.productRepository.save(updatedProduct);
      await queryRunner.commitTransaction();

      updatedProduct.changeHistory = [changeHistory];

      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    const product = await this.findOne(id.toString(), userId);

    await this.productRepository.remove(product);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'err-001') throw new NotFoundException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  private async updateMeasurementUnit(
    id: number,
    unit: string,
    productMeasurement: ProductMeasurement[],
  ) {
    if (id !== productMeasurement[0].id)
      throw new UnauthorizedException(
        `Measurement unit with id ${id} not found`,
      );

    const measurementUnit = await this.productMeasurementRepository.preload({
      id,
      unit,
    });

    return await this.productMeasurementRepository.save(measurementUnit);
  }

  private async updateStockInquiry(
    id: number,
    quantity: number,
    stockInquiries: StockInquiry[],
  ): Promise<StockInquiry> {
    if (id !== stockInquiries[0].id)
      throw new UnauthorizedException(
        `Measurement unit with id ${id} not found`,
      );
    const stockInquiry = await this.stockInquiryRepository.preload({
      id,
      quantity,
    });
    // if (!stockInquiry)
    //   throw new NotFoundException(`Stock Inquiry with id: '${id}' not found`);

    return await this.stockInquiryRepository.save(stockInquiry);
  }

  private async createChangeHistory(
    product: Product,
    updatedProduct: Product,
  ): Promise<ProductChangeHistory> {
    delete product.changeHistory;

    let changeHistory = this.productChangeRepository.create({
      description: `Product '${product.title}' was edited ${JSON.stringify(
        product,
      )}  --->  ${JSON.stringify(updatedProduct)}`,
      product,
    });
    changeHistory = await this.productChangeRepository.save(changeHistory);
    delete changeHistory.product;

    return changeHistory;
  }
}
