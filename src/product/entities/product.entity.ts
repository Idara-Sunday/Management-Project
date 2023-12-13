import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    productID:string;

    @CreateDateColumn()
    createdAt:Date;

    @Column()
    productName:string;

    @Column()
    productBrand:string;


}
