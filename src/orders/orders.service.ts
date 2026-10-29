import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model, Types } from 'mongoose';
import { Product } from '../product/schemas/product.schema';
import { User } from '../user/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async create(dto: CreateOrderDto) {
        const user = await this.userModel.findById(dto.userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const items = [];
        let totalAmount = 0;

        for (const item of dto.items) {
            const product = await this.productModel.findById(item.productId).exec();

            if (!product) {
                throw new NotFoundException("Product not found");
            }

            const price = product.price;

            items.push({
                product: new Types.ObjectId(item.productId),
                quantity: item.quantity,
                price,
            });

            totalAmount += price * item.quantity;
        }

        const order = await this.orderModel.create({
            user: user._id,
            items,
            totalAmount,
        });

        return order;
    }

    async findAll() {
        return this.orderModel.find().populate('user').populate('items.product').exec();
    }

    async findOne(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid order ID');
        }

        const order = await this.orderModel.findById(id).populate('user').populate('items.product').exec();

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }
}
