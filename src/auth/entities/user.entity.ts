import { Product } from 'src/products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {

   @PrimaryGeneratedColumn('uuid')
   public id: string;

   @Column({
      type: 'text',
      unique: true,
   })
   public email: string;
   
   @Column({
      type: 'text',
      select: false,
   })
   public password: string;

   @Column({
      type: 'text',
   })
   public fullName: string;

   @Column({
      type: 'bool',
      default: true,
   })
   public isActive: boolean;

   @Column({
      type: 'text',
      array: true,
      default: [ 'user' ]
   })
   public roles: string[];

   @OneToMany(
      () => Product,
      ( product ) => product.user
   )
   product: Product;

   @BeforeInsert()
   checkFieldsBeforeInsert( ) {
      this.email = this.email.toLowerCase().trim();
   }

   @BeforeUpdate()
   checkFieldsBeforeUpdate( ) {
      this.checkFieldsBeforeInsert();
   }
}
