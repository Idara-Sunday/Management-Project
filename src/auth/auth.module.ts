import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([User]),

  JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:(config:ConfigService) =>({global: true,
    secret:config.getOrThrow('JWT_SECRET'),
    signOptions:{
      expiresIn:config.getOrThrow('JWT_EXPIRESIN'),
      algorithm:config.getOrThrow('JWT_ALGORITH')},}),

  PassportModule.register({
    defaultStrategy:'jwt'}) 
  })

],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
