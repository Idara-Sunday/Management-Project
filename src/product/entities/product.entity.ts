import { User } from "src/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(()=>User,(user)=>user.product)
    user:User;
    


}
