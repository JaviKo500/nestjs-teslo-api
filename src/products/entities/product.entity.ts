import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
}
