import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports:[ConfigModule.forRoot({
    isGlobal:true
  }),
DatabaseModule,
AuthModule,
ProductModule,
CommentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}  
   