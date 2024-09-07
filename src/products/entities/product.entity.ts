import { ApiProperty } from '@nestjs/swagger';

import { User } from 'src/auth/entities/user.entity';
import { ProductImageEntity } from './product-image.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
   name: 'products'
})
export class Product {

   @ApiProperty()
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ApiProperty()
   @Column('text', {
      unique: true,
   })
   title: string;

   @ApiProperty()
   @Column('float', {
      default: 0
   })
   price: number;

   @ApiProperty()
   @Column({
      type: 'text',
      nullable: true,
   })
   description: string;

   @ApiProperty()
   @Column({ type: 'text', unique: true, })
   slug: string;

   @ApiProperty()
   @Column({ type: 'int', default: 0, })
   stock: number;

   @ApiProperty()
   @Column({ type: 'text', array: true, })
   sizes: string[];

   @ApiProperty()
   @Column( 'text' )
   gender: string;

   @ApiProperty()
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
