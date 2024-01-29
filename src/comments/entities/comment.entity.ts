import { User } from "src/entities/user.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    created_At:Date;

    @UpdateDateColumn()
    updated_At:Date;

    @Column()
    text:string; 

    @ManyToOne(()=>User,(user)=>user.comments,{onDelete:'SET NULL'})
    @JoinColumn()
    user:User;

    @ManyToMany(()=>Product ,(products)=>products.comments,{onDelete:'CASCADE'})
    products:Product[] 
}
