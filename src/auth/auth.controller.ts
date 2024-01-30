import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { signupDTO } from '../dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/signin.dto';
import { Request, Response } from 'express';
import { RolesGuard } from './guard/role.guard';
import { Roles } from './guard/roles';
import { AuthGuard } from '@nestjs/passport';
import { BlockGuard } from './guard/block.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ProfileDTO } from 'src/dto/profile.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){} 

  @Post('signup')
  @ApiCreatedResponse({description:'User Registration'})
  @ApiBody({type:signupDTO})
  async signUp(@Body() payload: signupDTO) {
    return await this.authService.signUp(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOkResponse({description:'User Login'})
  @ApiUnauthorizedResponse({description:'Invalid Credentials'})
  @ApiBody({type:SignInDto})
  async signin(@Body() payload:SignInDto,@Req() req:Request, @Res() res:Response){

   const token =  await this.authService.signIn(payload,res,req);
   return token
  }

  @UseGuards(AuthGuard() )
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req:Request){
    return  req.user
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout( @Req() req:Request ,@Res() res:Response){
    // this.authService.signOut(res)
    // res.send({message:'successfully logged out'})
    return await this.authService.signOut(req,res)
  } 

  @Get('getusers')
  @UseGuards(AuthGuard(),RolesGuard)
  @Roles('admin','user')
  async findAllUsers(){
    return await this.authService.findUsers()
  }

  @UseGuards(AuthGuard(),RolesGuard)
  @Roles('admin')
  @Post(':id/block')
  async blockUser(@Param('id') id:number){

    return await this.authService.blockUser(id);

  }


  @UseGuards(AuthGuard(),RolesGuard)
  @Roles('admin')
  @Post(':id/unblock')
  async unblockUser(@Param('id') id:number){

    return await this.authService.unblockUser(id)
  }

  @UseGuards(AuthGuard(),BlockGuard)
  @Get('hello')
  helloworld(){
    return `hello world`
  }

  @UseGuards(AuthGuard(),BlockGuard)
  @Post('create-profile')
  async createProfile(@Body() payload:ProfileDTO, @Req() req:Request){
    return await this.authService.createProfile(payload,req)
  }

  @UseGuards(AuthGuard(),BlockGuard,RolesGuard)
  @Roles('admin')
  @Delete(':id/delete-user')
  async deleteUser(@Param('id') id:number){

    return await this.authService.deleteUser(id)

  }


}  
 