import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AppContoller } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product,User])],
  controllers: [ProductController,AppContoller],
  providers: [ProductService,AppService],
})
export class ProductModule {}
