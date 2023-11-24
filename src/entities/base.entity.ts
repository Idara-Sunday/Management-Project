import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@ Entity()
export class Base {
    @PrimaryGeneratedColumn('uuid')
    id:string;


    @CreateDateColumn()
    created_At:Date;


    @CreateDateColumn()
    updated_At:Date;
}