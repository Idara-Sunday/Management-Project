import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
import { Response, Request } from 'express';
import { Profile } from 'src/entities/profile.entity';
import { ProfileDTO } from 'src/dto/profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private authRepo: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Profile) private profileRepo:Repository<Profile>
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
        throw new BadRequestException('this role should be lowercase');
      }
      return err;
    }
  }

  // IMPLEMENTING SIGN-IN

  async signIn(payload: SignInDto, @Res() res: Response, @Req() req: Request) {
    // Destructuting incoming payload

    const { email, password } = payload;

    // const registeredUser = await this.authRepo.findOne({ where: { email:email } });
    const registeredUser = await this.authRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: payload.email })
      .getOne();

    if (!registeredUser) {
      throw new HttpException('No email found', 400);
    }

    const isMatch = await bcrypt.compare(password, registeredUser.password);
    // console.log(isMatch);

    if (!isMatch) {
      throw new HttpException('Wrong password', 400);
    }

    const jwtPayload = {
      email: registeredUser.email,
      id: registeredUser.id,
      role: registeredUser.role,
    };

    const access_token = await this.jwtService.signAsync(jwtPayload);

    res.cookie('isAuthenticated', access_token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000,
    });
    // return { acessToken: access_token };
    return res.send({
      success: true,
      userToken: access_token,
    });
  }

  // Implementing Logout functionality

  async signOut(@Req() req: Request, @Res() res: Response) {
    const clearCookie = res.clearCookie('isAuthenticated');
    const response = res.send('user successfully logout');
    return {
      clearCookie,
      response,
    };
  }

  async findUsers() {
    // return await this.authRepo.find();
    const users = await this.authRepo.find({relations:['product','comments','profile']});

    const mappedUsers = users.map((user)=> user.userReturn())
    return mappedUsers
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
      // console.log(token);

      const secret = process.env.JWT_SECRET;
      try {
        const decoded = this.jwtService.verify(token);
        // console.log(decoded)
        let id = decoded['id'];
        // console.log(id)
        let user = await this.authRepo.findOneBy({ id });

        return {
          id:user.id,
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

  async blockUser(id: string) {
    const user = await this.authRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    user.blocked = true;

    return await this.authRepo.save(user);
  }

  async unblockUser(id: string) {
    const user = await this.authRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    user.blocked = false;

    return await this.authRepo.save(user)
  }

  async userbyId(id:string){
    return await this.authRepo.findOneBy({id})
  }


  async createProfile(payload:ProfileDTO ,@Req() req:Request){
    const user = req.user;
    if(!user){
      throw new HttpException('user not found',HttpStatus.NOT_FOUND)
    }
    const id = user['id']

    const findUser = await this.authRepo.findOne({where:{id:id}});

    if(!findUser){
      throw new HttpException('no user was found',HttpStatus.NOT_FOUND)
    }
  try{
    const userProfile = this.profileRepo.create({
      ...payload,
      user      
    });

    return await this.profileRepo.save(userProfile)

  }catch(error){
    return error
  }
}

  async deleteUser(id:string){
    
    const user = await this.authRepo.findOne({where:{id}});
    if(!user){
      throw new HttpException('User not found',HttpStatus.NOT_FOUND)
    }

    const deleteUser = await this.authRepo.delete(id)

    return{
      message:'user succesfully deleted',
      deleteUser
    }
  }



}
