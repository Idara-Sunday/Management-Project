import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    productName:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    productBrand:string;
}
 