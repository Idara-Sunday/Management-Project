import { CanActivate, ExecutionContext, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

export class BlockGuard implements CanActivate {

    constructor(private readonly blockService:AuthService){}
    async canActivate(context:ExecutionContext):Promise<boolean>{

        const request = context.switchToHttp().getRequest();

        const user = request.user?.id;
        console.log(user)
        // const findUser = await this.blockService.userbyId(user)

        if(user.blocked || !user){
            throw new UnauthorizedException(`invalid user`)
        }
        return true
    }
}