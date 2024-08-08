import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImageEntity, Product } from './entities';
@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,

    private readonly dataSource:  DataSource,
  ) {
    
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( img => this.productImageRepository.create({ url:  img }) )
      });
      await this.productRepository.save( product );
      return { ...product, images };
    } catch (error) {
      this.handelDBExceptions(error);
    }
  }

  async findAll( { limit = 10, offset = 0 }: PaginationDto ) {
    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });
      return products.map( ({ images, ...rest }) => ({ 
        ...rest, 
        images: images.map( img => img.url ),
      }));
    } catch (error) {
      this.handelDBExceptions( error );
    }
  }

  async findOne(query: string) {
    try {
      let product: Product;
      if ( isUUID( query ) ) { 
        product = await this.productRepository.findOneBy(
          {
            id: query
          }
        );
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder
          .where(
            `LOWER(title) =:title or slug =:slug`, 
            { 
              title: query.toLowerCase(), 
              slug: query.toLowerCase(),
            }
          )
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne();
      }

      if ( !product ) throw new NotFoundException( `Product whit query "${query}" not found` );

      // product.images = product.images.map( image => image.url );
      return product;
    } catch (error) {
      this.handelDBExceptions(error);
    }
  }

  async findOnePlain( query: string ) {
    const product = await this.findOne( query );
    return {
      ...product,
      images: product.images.map( image => image.url ),
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      if ( images ) {
        await queryRunner.manager.delete(
          ProductImageEntity,
          {
            product: {
              id
            }
          }
        );
        product.images = images.map( image => this.productImageRepository.create( { url: image } ));
      }

      if ( !product ) throw new NotFoundException( `Product whit id "${id}" not found` );
      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain( id );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handelDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne( id );
      await this.productRepository.remove(
        product
      );
    } catch (error) {
      this.handelDBExceptions(error);
    }
  }

  private handelDBExceptions(error: any) {
    if ( error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if ( error.status === 404 ) {
      throw new NotFoundException( error.message );
    }
    this.logger.error( `${error.message} - ${error.detail}` );
    throw new InternalServerErrorException('Unexpected error check server logs');
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handelDBExceptions( error );
    }
  }
}
