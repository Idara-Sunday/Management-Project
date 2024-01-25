import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/guard/roles';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard(),RolesGuard)
  @Roles('admin','unknown')
  async create(@Body() payload: CreateProductDto, @Req() req:Request) { 
    return await this.productService.create(payload,req);
  }

  @Get()
  @UseGuards(AuthGuard(),RolesGuard)
  @Roles('admin','unknown')
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateProductDto) {
    return this.productService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
