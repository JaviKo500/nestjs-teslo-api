import { ProductImageEntity } from './product-image.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
   name: 'products'
})
export class Product {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('text', {
      unique: true,
   })
   title: string;

   @Column('float', {
      default: 0
   })
   price: number;

   @Column({
      type: 'text',
      nullable: true,
   })
   description: string;

   @Column({ type: 'text', unique: true, })
   slug: string;

   @Column({ type: 'int', default: 0, })
   stock: number;

   @Column({ type: 'text', array: true, })
   sizes: string[];

   @Column( 'text' )
   gender: string;

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
