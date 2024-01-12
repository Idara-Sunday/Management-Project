import {
  BadRequestException,
  HttpException,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { signupDTO } from '../dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { Response ,Request} from 'express';

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

  async signIn(payload: SignInDto, @Req() @Res() res: Response,@Req() req:Request) {
    // Destructuting incoming payload

    const { email, password } = payload;

    // const registeredUser = await this.authRepo.findOne({ where: { email:email } });
    const registeredUser = await this.authRepo.createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", {email:payload.email}).getOne()

    if (!registeredUser) {
      throw new HttpException('No email found', 400);
    }

    const isMatch = await bcrypt.compare(password, registeredUser.password);
    console.log(isMatch);

    if (!isMatch) {
      throw new HttpException('Wrong password', 400);
    }

    const jwtPayload = {
      sub: registeredUser.email,
      userId: registeredUser.id,
    };

    const access_token = await this.jwtService.signAsync(jwtPayload);

    res.cookie('isAuthenticated', access_token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000,
    });
    // return { acessToken: access_token };
    return res.send({
    success:true,
    userToken:access_token
    })
  }

  // Implementing Logout functionality

  async signOut(@Req() req:Request ,@Res() res: Response){
   const clearCookie = res.clearCookie('isAuthenticated');
   const response = res.send('user successfully logout')
   return {
    clearCookie,
    response
   }
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
