import { Body, Controller, Post } from '@nestjs/common';
import { signupDTO } from 'src/dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}
  @Post()
  async signUp(@Body() payload: signupDTO) {
    return await this.authService.signUp(payload);
  }
}
