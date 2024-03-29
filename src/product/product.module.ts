import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { User } from 'src/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Profile } from '../entities/profile.entity';
import { Comment } from '../comments/entities/comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product,User,Comment]),AuthModule],
  controllers: [ProductController],
  providers: [ProductService], 
})
export class ProductModule {} 
  