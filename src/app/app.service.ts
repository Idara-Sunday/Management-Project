import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
    constructor(@InjectRepository(User) private userRepo:Repository<User>,@InjectRepository(Product) private productRepo:Repository<Product>){}

   async seed(){
        const user1 = this.userRepo.create({firstName:'james',lastName:'ubong',email:'james@gmail.com',password:'123##AB$$'});
        await this.userRepo.save(user1)
       

        const product1 = this.productRepo.create({productName:'cream',productBrand:'familia'});
        await this.productRepo.save(product1)


        const product2 = this.productRepo.create({productName:'milk',productBrand:'loya'});
        await this.productRepo.save(product2)

        user1.product =[product1,product2]
        await this.userRepo.save(user1)
    }

}

