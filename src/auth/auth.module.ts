import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategy/jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([User]),

  JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:async (config:ConfigService) =>({
    secret:config.getOrThrow<string>('JWT_SECRET'),
    signOptions:{
      expiresIn:config.getOrThrow<string>('JWT_EXPIRESIN'),
      algorithm:config.getOrThrow('JWT_ALGORITH')},
    }),
  }),
  PassportModule.register({
    defaultStrategy:'jwt'}) 
],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports:[JwtStrategy,PassportModule,AuthService]
})
export class AuthModule {}
