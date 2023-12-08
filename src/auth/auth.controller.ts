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
    const token = await this.authService.signIn(payload);
    res.cookie('Authenticated',token,{
      httpOnly:true,
      maxAge:1*60*60*24
    });
    return res.send({
      success:true,
      userToken:token
    })
    
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req){
    return await req.user
  }

}  
 