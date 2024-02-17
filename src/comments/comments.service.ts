import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Param, Req } from '@nestjs/common';
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
    
    const id = user['id'];

    const findUser = await this.authRepo.findOne({where:{id:id},relations:['comments']});
    if(!findUser){
      throw new HttpException('No user found',HttpStatus.NOT_FOUND);
    }

     const findProduct =await this.productRepo.findOne({where:{productID:productId},relations:['comments']});
     if(!findProduct){
      throw new HttpException('product not found',HttpStatus.NOT_FOUND);
     }

     const products = [findProduct]

    const comment = this.commentRepo.create({
      ...createCommentDto,
      user,
      products
      
    }); 
  return await this.commentRepo.save(comment)

  // ********* OR *******
  /*
  const comment = this.commentRepo.create({
    ...createCommentDto,
    user,
  
    
  }); 
    
    const saveComment = await this.commentRepo.save(comment);
    findProduct.comments.push(saveComment)
    await this.productRepo.save(findProduct)
    return{ 
      findProduct
    }            
    */
// ******** ENDS HERE*********    

  
    // findProduct.comments=[saveComment] **** THIS APPROACH DOESN'T WORK
    
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


  async editComment(@Req() req:Request, payload:UpdateCommentDto,commentId:number){

    const requestUser = req.user;

    const userId = requestUser['id'];

    const user = await this.authRepo.findOne({where:{id:userId}}); 

    if(!user){
      throw new NotFoundException('User not found');
    }
    

    const productWithTheComment = await this.productRepo
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.comments','comments')
    .where('comments.id = :commentId',{commentId})
    .getOne()    

    if(!productWithTheComment){
      throw new HttpException('product not found',HttpStatus.BAD_REQUEST)
    }

   
    const findComment = await this.commentRepo.findOne({where:{id:commentId}});
    
    if(!findComment){
      throw new NotFoundException('comment not found');
    }

    const userWhoMadeComment= await this.authRepo
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.comments','comments')
    .where('comments.id = :commentId', {commentId})
    .getOne()

    const userWhoMadeCommentId = userWhoMadeComment['id'];

    if(userId !== userWhoMadeCommentId){
      throw new HttpException('you cant edit this comment',HttpStatus.BAD_REQUEST)
    }
    
    return await this.commentRepo.update(commentId,payload)

  }



  async deleteComment(@Req() req:Request, commentId:number, productId:number){
    const reqUser= req.user; 

  const userId = reqUser['id'];
  

  const findUser = await this.authRepo.findOne({where:{id:userId}});

  if(!findUser){
    throw new HttpException('No user found',HttpStatus.NOT_FOUND);
  }

  const findProduct = await this.productRepo.findOne({where:{productID:productId}});
  if(!findProduct){
    throw new HttpException('No Product found',HttpStatus.NOT_FOUND);
  }

  const checkComment = await this.commentRepo.findOne({where:{id:commentId},relations:['user','products']});

  if(!checkComment){
    throw new HttpException('comment not found',HttpStatus.NOT_FOUND);
  }

  // TO FIND THE USER WHO MADE THIS COMMENT
  const userWhoMadeComment = await this.authRepo
  .createQueryBuilder('user')
  .innerJoin('user.comments', 'comment')
  .where('comment.id = :commentId', {commentId })       
  .getOne();
 
  const userWhoMadeCommentId =userWhoMadeComment['id'];
    
  // TO FIND THE USER WHO POSTED THE PRODUCT THAT IS HAVING THE COMMENT
  const userWhoPostedProduct = await this.commentRepo
  .createQueryBuilder('comment')
  .leftJoinAndSelect('comment.products','products')
  .leftJoinAndSelect('products.user','user')
  .where('comment.id = :commentId',{commentId})
  .getOne(); 

  const productWithUserWhoPostedIt = (userWhoPostedProduct.products[0].user);
  const userWhoPostedProductId =productWithUserWhoPostedIt['id'];
  
  if( userId !== userWhoPostedProductId && userId !== userWhoMadeCommentId ){
    throw new HttpException('You cant delete this comment cuz you wer not the one who posted made the comment nor posted the product',HttpStatus.NOT_IMPLEMENTED);
  }
  
  const deleteComment = await this.commentRepo.delete(commentId);
  return{
    message:'comment successfully deleted',
    deleteComment
    
  }

 

  }

  async findAllcomments(){
    const findcomments = await this.commentRepo.find({relations:['user']})
    return findcomments
  }

  
  async findOneComment(commentId: number) {
    const findOneComment = await this.commentRepo.findOne({where:{id:commentId},relations:['user']});
    if(!findOneComment){
      throw new HttpException('No comment Found',404);
    }
    return findOneComment;
  }

 

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
