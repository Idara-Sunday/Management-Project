import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { signupDTO } from '../dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/signin.dto';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){} 
  @Post('signup')
  async signUp(@Body() payload: signupDTO) {
    return await this.authService.signUp(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() payload:SignInDto,@Res() res:Response,@Req() req:Request){

   const token =  await this.authService.signIn(payload,res,req);
  
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req:Request){
    return await req.user
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout( @Req() req:Request ,@Res() res:Response){
    // this.authService.signOut(res)
    // res.send({message:'successfully logged out'})
    return await this.authService.signOut(req,res)
  } 
}  
 