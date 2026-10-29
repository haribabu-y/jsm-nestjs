import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;

    @IsString()
    category: string;

    @IsString()
    description: string;
}
