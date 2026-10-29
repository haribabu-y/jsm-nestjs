import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { isValidObjectId } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getAllProducts() {
        return this.productService.findAllProducts();
    }

    @Get(":id")
    GetProductById(@Param("id") id: string) {
        return this.productService.GetProductByID(id);
    }

    @Post()
    AddNewProduct(@Body() createProductDto: CreateProductDto) {
        return this.productService.savenewProduct(createProductDto);
    }

    @Put(":id")
    updateProduct(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.updateProduct(id, updateProductDto);
    }

    @Delete(":id")
    deleteProductById(@Param("id") id: string) {
        return this.productService.deleteProductById(id);
    }

    // @Delete()
    // deleteAllproducts() {

    // }
}
