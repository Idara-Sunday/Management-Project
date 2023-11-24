import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule.forRoot({
    isGlobal:true
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
  