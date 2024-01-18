import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { signupDTO } from '../dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/signin.dto';
import { Request, Response } from 'express';
import { RolesGuard } from './guard/role.guard';
import { Roles } from './guard/roles';
import { AuthGuard } from '@nestjs/passport';
import { BlockGuard } from './guard/block.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){} 
  @Post('signup')
  async signUp(@Body() payload: signupDTO) {
    return await this.authService.signUp(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() payload:SignInDto,@Req() req:Request, @Res() res:Response){

   const token =  await this.authService.signIn(payload,res,req);
   return token
  }

  @UseGuards(AuthGuard() )
  @Get('profile')
  async getProfile(@Req() req:Request){
    return  req.user
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout( @Req() req:Request ,@Res() res:Response){
    // this.authService.signOut(res)
    // res.send({message:'successfully logged out'})
    return await this.authService.signOut(req,res)
  } 

  @Get('getusers')
  @UseGuards(AuthGuard(),RolesGuard)
  @Roles('admin','user')
  async findAllUsers(){
    return await this.authService.findUsers()
  }

  @Post(':id/block')
  async blockUser(@Param() id:string){

    return await this.authService.blockUser(id);

  }

  @Post('id/unblock')
  async unblockUser(@Param() id:string){

    return await this.authService.unblockUser(id)
  }

  @UseGuards(BlockGuard)
  @Get('hello')
  helloworld(){
    return `hello world`
  }

}  
 