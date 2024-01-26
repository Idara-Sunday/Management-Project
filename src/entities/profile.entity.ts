import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Profile extends Base{
    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column({nullable:true})
    middleName: string;

    @OneToOne(()=> User,(user)=>user.profile,{onDelete:'CASCADE'} )
    @JoinColumn()
    user:User
}