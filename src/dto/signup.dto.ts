import { IsNotEmpty, IsString, IsOptional, MinLength, MaxLength, Matches } from "class-validator";

export class signupDTO{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    firstName:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    lastName:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsOptional()
    middleName?: string;

    @IsNotEmpty()
    @IsString()
    email:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6,{message:'sorry you must puty in 6 characters'})
    @MaxLength(16,{message:'Password must not be more than 16 characters'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, {message:'password must contain at least one uppercase,one number and one special key'})
    password:string;

}