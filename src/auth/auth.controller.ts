import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { signupDTO } from 'src/dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/signin.dto';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){} 
  @Post('signup')
  async signUp(@Body() payload: signupDTO) {
    return await this.authService.signUp(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() payload:SignInDto,@Res() res:Response){

    
   const token =  await this.authService.signIn(payload,res);
   return res.send({
    success:true,
    usertoken:token
   })
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req){
    return await req.user
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res() res:Response):Promise<void>{
    this.authService.signOut(res)
    res.send({message:'successfully logged out'})
  }
}  
 