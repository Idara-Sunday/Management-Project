import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { AppService } from './app/app.service';

@Module({
  imports:[ConfigModule.forRoot({
    isGlobal:true
  }),
DatabaseModule,
AuthModule,
ProductModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}  
   