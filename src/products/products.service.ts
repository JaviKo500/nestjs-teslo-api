import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { title } from 'process';
@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {
    
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(
        createProductDto,
      );
      await this.productRepository.save( product );
      return product;
    } catch (error) {
      this.handelDBExceptions(error);
    }
  }

  findAll( { limit = 10, offset = 0 }: PaginationDto ) {
    try {
      return this.productRepository.find({
        take: limit,
        skip: offset,
      });
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
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where(
            `LOWER(title) =:title or slug =:slug`, 
            { 
              title: query.toLowerCase(), 
              slug: query.toLowerCase(),
            }
          )
          .getOne();
      }

      if ( !product ) throw new NotFoundException( `Product whit query "${query}" not found` );
      return product;
    } catch (error) {
      this.handelDBExceptions(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      
    } catch (error) {
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
    throw new InternalServerErrorException('Unexpected error check server lgos');
  }
}
