import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AppContoller } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';

@Module({
  imports:[TypeOrmModule.forFeature([Product])],
  controllers: [ProductController,AppContoller],
  providers: [ProductService,AppService],
})
export class ProductModule {}
