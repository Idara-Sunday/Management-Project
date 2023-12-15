import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { signupDTO } from 'src/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // IMPLEMENTING SIGN UP
  async signUp(payload: signupDTO) {

    // Destructuring incoming payload
    const { email, password, ...rest } = payload;

    const user = await this.authRepo.findOne({ where: { email } });
    if (user) {
      throw new HttpException('user with this email already exist', 400);
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const savedUser = await this.authRepo.save({
      ...rest,
      email,
      password: hashPassword,
    });

    delete savedUser.password;
    return savedUser;
  }

  // IMPLEMENTING SIGN-IN

  async signIn(payload: SignInDto, res: Response) {
    // Destructuting incoming payload
    
    const { email, password } = payload;

    const registeredUser = await this.authRepo.findOne({ where: { email } });

    if (!registeredUser) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, registeredUser.password);
    console.log(isMatch);

    if (!isMatch) {
      throw new HttpException('Invalid credentials', 401);
    }

    const jwtPayload = {
      sub: registeredUser.email,
      userId: registeredUser.id,
      
    };

    const access_token = await this.jwtService.signAsync(jwtPayload);

    res.cookie('Authenticated', access_token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 24,
    });
    return { acessToken:access_token };
  }

  // Implementing Logout functionality

  async signOut(res: Response): Promise<void> {
    res.clearCookie('Authenticated');
  }

  async findEmail(email:string){
    const mail = await this.authRepo.findOneByOrFail({email});
    if(!mail){
      throw new UnauthorizedException()
    }
    return mail;
  }

  async user(headers:any):Promise<any>{
    const authorizationHeader = headers.authorization;
    if (authorizationHeader){
      const token = authorizationHeader.replace('Bearer','').trim();
      console.log(token);
      
      const secret = process.env.JWt_SECRET;
      try{
        const decoded = this.jwtService.verify(token);
        let id = decoded["id"];
        let user = await this.authRepo.findOneBy({id});

        return {id,firstname:user.firstName,lastname:user.lastName,email:user.email,role:user.role};
      } catch (error){
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new  UnauthorizedException('Invalid or missing Bearer token');
    }

  }
}
