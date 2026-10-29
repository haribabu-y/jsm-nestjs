import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private  ProductModel: Model<Product>
    ){}

    async findAllProducts() {
        const products: Product[] =  await this.ProductModel.find().exec();

        if(products.length == 0) {
            throw new NotFoundException("Products not found");
        }
        return products;
    }

    async GetProductByID(id: string) {
        if(!isValidObjectId) {
            throw new BadRequestException("Invalid Product ID");
        }
        const product = await this.ProductModel.findById(id).exec();

        if(!product) {
            throw new NotFoundException("Product not found!");
        }
        return product;
    }

    async savenewProduct(createProductDto: CreateProductDto) {
        const exsitingProduct = await this.ProductModel.findOne({$or: [{name: createProductDto.name}]});
        console.log(exsitingProduct);        
        if(exsitingProduct) {
            throw new BadRequestException("Product already present");
        }
        return this.ProductModel.create(createProductDto);
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        if(!isValidObjectId(id)) {
            throw new BadRequestException("Invalid Product ID");
        }
        // const product = await this.ProductModel.findById(id);
        // if(!product) {
        //     throw new NotFoundException("Product not found");
        // }
        // const product =  await this.ProductModel.findOneAndReplace(
        //     {_id: id},
        //     updateProductDto,
        //     {new: true, runValidators: true}
        // );

        const product = await this.ProductModel.findByIdAndUpdate(id, updateProductDto);

        if(!product) {
            throw new NotFoundException("User not found");
        }
        return product;
    }

    deleteProductById(id: string) {
        if(!isValidObjectId(id)) {
            throw new BadRequestException("Invalid Product ID");
        }
        return this.ProductModel.findByIdAndDelete(id);
    }

    // deleteAllProducts() {
    //     return this.ProductModel.deleteMany()
    // }

}
