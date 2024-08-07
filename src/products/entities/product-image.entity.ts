import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductImageEntity {
   
   @PrimaryGeneratedColumn()
   id: number;

   @Column('text')
   url: string;
}