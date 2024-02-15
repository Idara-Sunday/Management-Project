import { HttpException, HttpStatus, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly prodRepo:Repository<Product>,@InjectRepository(User) private readonly userRepo:Repository<User>,@InjectRepository(Comment) private readonly commentRepo: Repository<Comment>){}
  
 async create(payload: CreateProductDto, @Req() req:Request) {
  const user = req.user;
  const id = user['id'];
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
    if(!findUser){
      throw new HttpException('User not found',HttpStatus.NOT_FOUND);
    }

    const findProduct = await this.prodRepo.findOne({where:{productID},relations:['comments']});
   
    if(!findProduct){
      throw new NotFoundException('product not found')            
    }
 
    // **** THE VARIABLE BELOW IS TO FIND FIND THE USER WHO POSTED THE PRODUCT ****

    const findUserUsingQueryBuilder = await this.userRepo
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.product','product')
    .where('product.productID = :productID',{productID})
    .getOne()

    const userWhoPostedTheProductID = findUserUsingQueryBuilder['id'];

    if(userId !== userWhoPostedTheProductID){
      throw new HttpException('you cant delete this product cuz you wer not the one who posted it',HttpStatus.NOT_IMPLEMENTED)
    } 
     console.log('these are the comment ids');
     
    const commentIds = findProduct.comments.map((comment)=>comment.id);
    console.log(commentIds)
    if(commentIds.length < 1){
      const delProd = await this.prodRepo.delete(productID);
      return{
        message:'product succesfully deleted',
        delProd
      }
    }

    // ******* THIS APPROACH BELOW IS TO ALSO DELETE A PRODUCT AND IT RELATED COMMENTS IN THE JOIN TABLE BUT NOT DELETING THE COMMENTS IN THE COMMENTS TABLE  ******

    // await this.prodRepo
    // .createQueryBuilder()
    // .relation(Product,'comments')
    // .of(productID)
    // .remove(commentIds) 
    
    // ******  ENDS HERE ******
     

  const delProd = await this.prodRepo.delete(productID);
   await this.commentRepo.delete(commentIds) 
   
    return {
      message:'product deleted successfully',
      delProd
    }


  }



  async findAll() {
    const allUsers = await this.prodRepo.find({relations:['user','comments']});
     return allUsers
  } 



  async findOne(productID:number) {
    return await this.prodRepo.findOne({where:{productID},relations:['comments']});
  }

 

}
