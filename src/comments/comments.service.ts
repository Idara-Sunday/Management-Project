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


  async createComment(createCommentDto: CreateCommentDto, productId:string,@Req() req:Request) {
    const user = req.user;
    // console.log(user);
    
    const id = user['id'];

    const findUser = await this.authRepo.findOne({where:{id:id}});
    if(!findUser){
      throw new HttpException('No user found',HttpStatus.NOT_FOUND);
    }

    const findProduct = await this.productRepo.findOne({where:{productID:productId}});
    if(!findProduct){
      throw new HttpException('No product Found',HttpStatus.NOT_FOUND)
    }

    // const commentt = this.commentRepo.create({
    //   ...createCommentDto
    // });

    // findUser.comments =[commentt]
    // findProduct.comments = [commentt]
    //  await this.productRepo.save(findProduct)
    //  await this.commentRepo.save(findUser)

    // return {findProduct}


    const comment =  this.commentRepo.create({
      ...createCommentDto,
      user,
      
    });
    findProduct.comments =[comment]

    const saveComment = await this.commentRepo.save(comment);

    const saveProductComment = await this.productRepo.save(findProduct)  
    
    return {saveComment,saveProductComment}
  }

  findAll() {
    return `This action returns all comments`;
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
