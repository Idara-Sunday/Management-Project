import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProfileDTO {
    @IsString()
    @IsNotEmpty()
    firstName:string;

    @IsString()
    @IsNotEmpty()
    lastName:string;

    @IsString()
    @IsOptional()
    middleName:string;
}