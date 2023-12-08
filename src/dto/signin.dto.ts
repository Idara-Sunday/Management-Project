import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";

export class SignInDto {
    
    @IsNotEmpty()
    @IsString()
    email:string;

    @IsNotEmpty()
    @IsString()
    // @MinLength(6,{message:'sorry you must put in at least 6 characters'})
    // @MaxLength(16,{message:'Password must not be more than 16 characters'})
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, {message:'password must contain at least one uppercase,one number and one special character'}) 
    password:string; 
}