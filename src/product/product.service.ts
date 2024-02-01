import { HttpException, HttpStatus, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly prodRepo:Repository<Product>,@InjectRepository(User) private readonly userRepo:Repository<User>){}

 async  create(payload: CreateProductDto, @Req() req:Request) {
  const user = req.user;
  const id = user['id'];
  // const findUser = await this.userRepo.findOne({where:{id}})
  const createProduct =  this.prodRepo.create({
    ...payload,
    user
  })
  return await this.prodRepo.save(createProduct)

    
  }
    

  async deleteProduct(productID:number,@Req() req:Request){
    const user = req.user;

    const userId = user['id'];

    const findUser = await this.userRepo.findOne({where:{id:userId}});
    // console.log(findUser);
    if(!findUser){
      throw new HttpException('User not found',HttpStatus.NOT_FOUND);
    }

    const findProduct = await this.prodRepo.findOne({where:{productID},relations:['comments']});
    console.log(findProduct);
    

    if(!findProduct){
      throw new NotFoundException('product not found')            
    }

    const findUserUsingQueryBuilder = await this.userRepo
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.product','product')
    .where('product.productID = :productID',{productID})
    .getOne()
    // console.log(findUserUsingQueryBuilder);

    const userWhoPostedTheProductID = findUserUsingQueryBuilder['id'];

    if(userId !== userWhoPostedTheProductID){
      throw new HttpException('you cant delete this product cuz you wer not the one who posted it',HttpStatus.NOT_IMPLEMENTED)
    }
    
    const delproduct = await this.prodRepo.delete(productID);

    return {
      delproduct
    }


  }




  async findAll() {
    return await this.prodRepo.find();
  } 

  async findOne(productID:number) {
    return await this.prodRepo.findOne({where:{productID}});
  }

  async update(id:string, payload: UpdateProductDto) {
    return this.prodRepo.update(id,payload);
  }


  async remove(id:string) {
    return this.prodRepo.delete(id);
  }
}
