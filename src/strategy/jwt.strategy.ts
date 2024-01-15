import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }     

   
    async validate(payload: {email}):Promise<User>{
        try{

            const {email} = payload;
            const user =await this.authService.findEmail(email);
            if(!user){
                throw new UnauthorizedException('Login first to access this endpoint')
            }
            return user;
        } catch(error) {

            console.error('Error validating token:', error);
            throw new UnauthorizedException('Invalid token')
        }
       
    }
}