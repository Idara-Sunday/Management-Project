import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { signupDTO } from 'src/dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/signin.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){} 
  @Post('signup')
  async signUp(@Body() payload: signupDTO) {
    return await this.authService.signUp(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() payload:SignInDto){
    return await this.authService.signIn(payload)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req){
    return await req.user
  }

}  
 