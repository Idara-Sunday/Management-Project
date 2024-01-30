import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@ Entity()
export class Base {
    @PrimaryGeneratedColumn()
    id:number;


    @CreateDateColumn()
    created_At:Date;


    @CreateDateColumn()
    updated_At:Date;
}