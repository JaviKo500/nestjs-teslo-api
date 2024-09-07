import { ApiProperty } from '@nestjs/swagger';

import { User } from 'src/auth/entities/user.entity';
import { ProductImageEntity } from './product-image.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
   name: 'products'
})
export class Product {

   @ApiProperty({
      example: 'fb2dc4c6-3087-4f44-baed-dfb2c0cfbb9a',
      description: 'Product UUID',
      uniqueItems: true,
   })
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ApiProperty({
      example: 'T-shirt teslo',
      description: 'Product title',
      uniqueItems: true,
   })
   @Column('text', {
      unique: true,
   })
   title: string;

   @ApiProperty({
      example: '2.5',
      description: 'Product price',
   })
   @Column('float', {
      default: 0
   })
   price: number;

   @ApiProperty({
      example: 'T shirt summer',
      description: 'Product description',
   })
   @Column({
      type: 'text',
      nullable: true,
   })
   description: string;

   @ApiProperty({
      example: 't-shirt',
      description: 'Product slug',
      uniqueItems: true,
   })
   @Column({ type: 'text', unique: true, })
   slug: string;

   @ApiProperty({
      example: '10',
      description: 'Product stock',
   })
   @Column({ type: 'int', default: 0, })
   stock: number;

   @ApiProperty({
      example: [ 'X', 'XL', 'L', 'S' ],
      description: 'Product sizes',
   })
   @Column({ type: 'text', array: true, })
   sizes: string[];

   @ApiProperty({
      example: 'woman',
      description: 'Product gender',
   })
   @Column( 'text' )
   gender: string;

   @ApiProperty({
      example: ['t-shirt', 'woman'],
      description: 'Product tags',
   })
   @Column({ type: 'text', array: true, default: [], nullable: true })
   tags: string[];

   @OneToMany(
      () => ProductImageEntity,
      productImage => productImage.product,
      {
         cascade: true,
         eager: true,
      }
   )
   images?: ProductImageEntity []

   @ManyToOne(
      () => User,
      ( user ) => user.product,
      {
         eager: true,
      }
   )
   user: User;

   @BeforeInsert()
   checkSlugInsert() {
     if ( !this.slug ) {
       this.slug = this.title;
     }
      this.formatSlug();
   }

   @BeforeUpdate()
   checkSlugUpdate() {
      this.slug = this.title;
      this.formatSlug();
   }

   private formatSlug() {
      this.slug = this.slug
        .normalize('NFD')
        // .replace(/[^a-z0-9]/g, '')
        .replace("'", '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_');
   }
}
