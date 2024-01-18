import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Roles } from "src/enum/role";
import { Product } from "src/product/entities/product.entity";

@Entity()
export class User extends Base{
    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column({nullable:true})
    middleName: string;

    @Column({
        unique:true
    })
    email:string;

    @Column()
    password:string;

    @Column({default:false})
    blocked:boolean;

    @Column({
        type:'enum',
        enum:Roles,
        default:Roles.unknown
    })
    role:Roles

    @OneToMany(()=>Product, (product)=>product.user)
    product:Product[]
    
} 