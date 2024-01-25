import { Column } from "typeorm";

export class Profile {
    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column({nullable:true})
    middleName: string;
}