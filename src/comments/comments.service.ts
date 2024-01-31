import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private readonly commentRepo:Repository<Comment>,
  @InjectRepository(Product) private readonly productRepo:Repository<Product>,
  @InjectRepository(User) private readonly authRepo:Repository<User>
  ){}


  async createComment(createCommentDto: CreateCommentDto, productId:number,@Req() req:Request) {

    const user = req.user; 
    // console.log(user); 
    
    const id = user['id'];

    const findUser = await this.authRepo.findOne({where:{id:id},relations:['comments']});
    // console.log(findUser)
    if(!findUser){
      throw new HttpException('No user found',HttpStatus.NOT_FOUND);
    }

     const findProduct =await this.productRepo.findOne({where:{productID:productId},relations:['comments']});
     if(!findProduct){
      throw new HttpException('product not found',HttpStatus.NOT_FOUND);
     }

    const comment = this.commentRepo.create({
      ...createCommentDto,
      user
    }); 

    const saveComment = await this.commentRepo.save(comment);
    findProduct.comments.push(saveComment)
    await this.productRepo.save(findProduct)
    return{
      findProduct
    }

 
    // findProduct.comments=[saveComment] ****
    
    // const saveProductComment = await this.productRepo.save(findProduct)  
    
    // return {saveProductComment}
    

    /////// **** THIS PART IS WORKING PERFECTLY **** ////////////
    /*
    
    const findProduct = await this.productRepo.findOne({where:{productID:productId},relations:['comments']});
    console.log(findProduct);
    
    if(!findProduct){
      throw new HttpException('No product Found',HttpStatus.NOT_FOUND)
    }
    
    const comment = this.commentRepo.create({
      ...createCommentDto
    }) 
    

    const saveProductComment = await this.commentRepo.save(comment)
    console.log(saveProductComment);
    const commentId = saveProductComment['id']
    console.log(commentId);
    
    const findComment = await this.commentRepo.findOne({where:{id:commentId}})
        
    
    findProduct.comments.push(findComment)
    await this.productRepo.save(findProduct)
    return {
      findProduct 
    } 
*/
    /////////// ENDS HERE //////////

  }

  async deleteComment(@Req() req:Request, id:number, productId:number){
    const user= req.user
    console.log(user);
    

  const userId = user['id']

  // const findUser = await this.authRepo.findOne({where:{id:userId}})

  const checkComment = await this.commentRepo.findOne({where:{id}});

  // console.log(checkComment)
  if(!checkComment){
    throw new HttpException('comment not found',HttpStatus.NOT_FOUND);
  }

  // TO FIND THE USER WHO MADE THIS COMMENT
  const userWhoMadeComment = await this.authRepo
  .createQueryBuilder('user')
  .innerJoin('user.comments', 'comment')
  .where('comment.id = :id', {id })
  .getOne();

    console.log(userWhoMadeComment);

    const userWhoMadeCommentId =userWhoMadeComment['id']

    /*
  // TO FIND THE USER WHO POSTED THE PRODUCT THAT IS HAVING THE COMMENT
  const userWhoPostedProduct = await this.commentRepo
  .createQueryBuilder('comment')
  .leftJoinAndSelect('comment.products','products')
  // .leftJoinAndSelect('products.user','user')
  // .select(['user.id', 'user.email', 'user.blocked', ])
  .where('comment.id = :id',{id})
  .getOne(); 

  console.log(userWhoPostedProduct.products);
  

  
  const userWhoPostedProductId =userWhoPostedProduct['id'];

  */
 /*
 const productWithTheComment = await this.productRepo
 .createQueryBuilder('product')
 .leftJoinAndSelect('product.comments','products')
 .where('product.productID = :productId',{productId}).
 getone()

 console.log(productWithTheComment);
 */

const productWithTheComment = await this.productRepo.find({
  where:{productID:productId},
  relations:['comments']
})
 
  // if(userId !== userWhoMadeCommentId){
  //   throw new HttpException('You cant delete this comment cuz you wer not the one who posted made the comment nor posted the product',HttpStatus.NOT_IMPLEMENTED)
  // }

  // const deleteComment = await this.commentRepo.delete(id);
  // return{
  //   message:'comment successfully deleted',
  //   deleteComment
  // }

  if(!productWithTheComment){
    throw new HttpException('product with this comment not found',HttpStatus.NOT_FOUND);
  }

  return {
    message:'its working',
    productWithTheComment
  }
  }

  async findAllcomment(){
    const findComment = await this.commentRepo.find({relations:['user']})
    return findComment
  }
  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
