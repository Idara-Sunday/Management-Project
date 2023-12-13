import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    productName:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    productBrand:string;
}
