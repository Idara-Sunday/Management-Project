import { ForbiddenException } from "@nestjs/common";

export class ForbiddenRoleException extends ForbiddenException {
    constructor(role:string){
        super(`You don't have the required role: ${role}`)
    }
}