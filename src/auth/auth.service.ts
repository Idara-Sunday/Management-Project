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
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Signing  up as a user
  async signUp(payload: signupDTO) {
    // Destructuring payload
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

  async signIn(payload: SignInDto) {
    const { email, password } = payload;

    const registeredUser = await this.authRepo.findOne({ where: { email } });

    if (!registeredUser) {
      throw new HttpException('No user with this email found', 401);
    }

    const isMatch = await bcrypt.compare(password, registeredUser.password);
    console.log(isMatch);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const result = {
      sub: registeredUser.email,
      userId: registeredUser.id,
      firstname: registeredUser.firstName,
      lastname: registeredUser.lastName,
    };

    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }
}
