import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppContoller {
    constructor(private readonly contro:AppService){}
    @Get()
    async getme(){
        await this.contro.seed()

        return 'Seed complete'
    }
}