import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ) {
    
  }
  async runSeed() {
    await this.productsService.deleteAllProducts();
    await this.insertNewProducts();
    const products = initialData.products;
    const insertPromises = [];

    // products.forEach((product) => {
    //   insertPromises.push(this.productsService.create( product ));
    // });
    const result = await Promise.all(insertPromises);
    return result;
  }

  private async insertNewProducts () {
    return true;
  }
}
