import { IsNotEmpty, IsString, IsOptional, MinLength, MaxLength, Matches, IsEmail } from "class-validator";
import { Roles } from "../enum/role";
import { ApiProperty } from "@nestjs/swagger";

export class signupDTO{
   

    @IsNotEmpty()  
    @IsString()
    @IsEmail()
    @ApiProperty({type:String, description:'email'})
    email:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8,{message:'sorry you must put in at least 8 characters'})
    @MaxLength(16,{message:'Password must not be more than 16 characters'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, {message:'password must contain at least one uppercase,one number and one special character'})  
    @ApiProperty({type:String, description:'password'})
    password:string;    
      
   @IsOptional()
   @ApiProperty({type:String, description:'role'})
   role:Roles
}