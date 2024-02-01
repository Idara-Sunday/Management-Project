import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { log } from 'console';

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
    /* ALTERNATIVE WAY FOR THE ABOVE APPROACH
    
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

  async deleteComment(@Req() req:Request, commentId:number, productId:number){
    const reqUser= req.user
    // console.log(reqUser);
    

  const userId = reqUser['id']
  // console.log(userId);
  

  const findUser = await this.authRepo.findOne({where:{id:userId}});

  if(!findUser){
    throw new HttpException('No user found',HttpStatus.NOT_FOUND);
  }

  const findProduct = await this.productRepo.findOne({where:{productID:productId}});
  if(!findProduct){
    throw new HttpException('No Product found',HttpStatus.NOT_FOUND);
  }

  const checkComment = await this.commentRepo.findOne({where:{id:commentId},relations:['user','products']});

  // console.log(checkComment)
  if(!checkComment){
    throw new HttpException('comment not found',HttpStatus.NOT_FOUND);
  }

  // TO FIND THE USER WHO MADE THIS COMMENT
  const userWhoMadeComment = await this.authRepo
  .createQueryBuilder('user')
  .innerJoin('user.comments', 'comment')
  .where('comment.id = :commentId', {commentId })       
  .getOne();

    // console.log(userWhoMadeComment);

    const userWhoMadeCommentId =userWhoMadeComment['id']
    // console.log(userWhoMadeCommentId);
    

    
  // TO FIND THE USER WHO POSTED THE PRODUCT THAT IS HAVING THE COMMENT
  const userWhoPostedProduct = await this.commentRepo
  .createQueryBuilder('comment')
  .leftJoinAndSelect('comment.products','products')
  .leftJoinAndSelect('products.user','user')
  .where('comment.id = :commentId',{commentId})
  .getOne(); 

  const productWithUserWhoPostedIt = (userWhoPostedProduct.products[0].user);
  const userWhoPostedProductId =productWithUserWhoPostedIt['id'];
  // console.log(userWhoPostedProductId);

  
  if( userId !== userWhoPostedProductId && userId !== userWhoMadeCommentId ){
    throw new HttpException('You cant delete this comment cuz you wer not the one who posted made the comment nor posted the product',HttpStatus.NOT_IMPLEMENTED);
  }
  
  const deleteComment = await this.commentRepo.delete(commentId);
  return{
    message:'comment successfully deleted',
    deleteComment
    
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
