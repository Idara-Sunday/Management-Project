import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
  imports:[ConfigModule.forRoot({
    isGlobal:true
  }),
DatabaseModule,
AuthModule,
ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}  
   