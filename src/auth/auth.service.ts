import {
  BadRequestException,
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
    payload.email = payload.email.toLowerCase();
    const { email, password, ...rest } = payload;
    const userEmail = await this.authRepo.findOne({ where: { email: email } });
    if (userEmail) {
      throw new HttpException('Sorry email already exist', 400);
    }

    const hashPassword = await bcrypt.hash(password, 12);

    try {    
      const user = await this.authRepo.create({
        ...rest,
        email,
        password: hashPassword,
      });

      await this.authRepo.save(user);

      delete user.password;
      return user;
    } catch (err) {
      if (err.code === '22P02') {
        throw new BadRequestException('admin role should be lowercase');
      }
      return err;
    }
  }

  // IMPLEMENTING SIGN-IN

  async signIn(payload: SignInDto, res: Response) {
    // Destructuting incoming payload

    const { email, password } = payload;

    const registeredUser = await this.authRepo.findOne({ where: { email:email } });

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
    return { acessToken: access_token };
  }

  // Implementing Logout functionality

  async signOut(res: Response): Promise<void> {
    res.clearCookie('Authenticated');
  }

  async findEmail(email: string) {
    const mail = await this.authRepo.findOneByOrFail({ email });
    if (!mail) {
      throw new UnauthorizedException();
    }
    return mail;
  }

  async user(headers: any): Promise<any> {
    const authorizationHeader = headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer', '').trim();
      console.log(token);

      const scret = process.env.JWt_SECRET;
      try {
        const decoded = this.jwtService.verify(token);
        let id = decoded['id'];
        let user = await this.authRepo.findOneBy({ id });

        return {
          id,
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Invalid or missing Bearer token');
    }
  }
}
