import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

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

  // TODO pagination
  findAll() {
    try {
      return this.productRepository.find();
    } catch (error) {
      this.handelDBExceptions( error );
    }
  }

  async findOne(query: string) {
    try {
      let product: Product = await this.productRepository.findOneBy(
        {
          slug: query
        }
      )
      if ( !product ) {
        product = await this.productRepository.findOneBy(
          {
            id: query
          }
        );
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
    this.logger.error( `${error.message} - ${error.detail}` );
    if ( error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if ( error.status === 404 ) {
      throw new NotFoundException( error.message );

    }
    throw new InternalServerErrorException('Unexpected error check server lgos');
  }
}
