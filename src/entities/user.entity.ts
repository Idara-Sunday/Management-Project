import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { Roles } from "src/enum/role";
import { Product } from "src/product/entities/product.entity";
import { Profile } from "./profile.entity";
import { Comment } from "src/comments/entities/comment.entity";

@Entity()
export class User extends Base{
   

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

    @OneToOne(()=>Profile, (profile)=>profile.user, {onDelete:'CASCADE'})
    profile:Profile

    @OneToMany(()=>Product, (product)=>product.user, {onDelete:'CASCADE'})
    product:Product[]

    @OneToMany(()=>Comment,(comments)=>comments.user, {onDelete:'CASCADE'})
    comments:Comment[];
    

    userReturn (){
        const {password, blocked, role ,id, created_At,updated_At, ...rest} = this
        return rest
     }
} 

 