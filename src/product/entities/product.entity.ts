import { Comment } from "src/comments/entities/comment.entity";
import { User } from "src/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(()=>User,(user)=>user.product,{onDelete:'CASCADE'})
    user:User;
    
    @ManyToMany(()=>Comment,(comments)=>comments.products,{onDelete:'CASCADE'})
    @JoinTable()
    comments:Comment[]

}
