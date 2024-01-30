import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { BlockGuard } from 'src/auth/guard/block.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard(),BlockGuard)
  @Post(':id/create-comment/')
  async createComment(@Body() createCommentDto: CreateCommentDto,@Param('id') id:number, @Req() req:Request) {
    return await this.commentsService.createComment(createCommentDto,id,req);
  }

  @UseGuards(AuthGuard(),BlockGuard)
 @Delete(':productId/delete-comment/:id')
 async deleteComment(@Param('productId') productId:number,@Req() req:Request,@Param('id') id:number){

  return await this.commentsService.deleteComment(req,id,productId)

 }


  @Get(':id')
  findOne(@Param('id') id:number) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(+id);
  }
}
