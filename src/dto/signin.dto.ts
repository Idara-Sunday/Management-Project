import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";

export class SignInDto {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({type:String, description:'email'})
    email:string;

    @IsNotEmpty()
    @IsString()
    // @MinLength(6,{message:'sorry you must put in at least 6 characters'})
    // @MaxLength(16,{message:'Password must not be more than 16 characters'})
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, {message:'password must contain at least one uppercase,one number and one special character'}) 
    @ApiProperty({type:String, description:'password'})
    password:string; 
}