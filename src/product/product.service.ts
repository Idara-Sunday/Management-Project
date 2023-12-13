import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly prodRepo:Repository<Product>){}

 async  create(payload: CreateProductDto) {
  return await this.prodRepo.save(payload)
    
  }
    
  async findAll() {
    return await this.prodRepo.find();
  }

  async findOne(productID:string) {
    return await this.prodRepo.findOne({where:{productID}});
  }

  async update(id:string, payload: UpdateProductDto) {
    return this.prodRepo.update(id,payload);
  }


  async remove(id:string) {
    return this.prodRepo.delete(id);
  }
}
