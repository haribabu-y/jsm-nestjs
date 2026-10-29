import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({_id: false})
export class OrderItem {
    @Prop({
        type: Types.ObjectId,
        ref: "Product",
        required: true
    })
    product: Types.ObjectId;

    @Prop({required: true, min: 1})
    quantity: number;

    @Prop({required: true, min: 0})
    price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({timestamps: true, versionKey: false})
export class Order {

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: true
    })
    user: Types.ObjectId;

    @Prop({
        type: [OrderItemSchema],
        required: true,
        validate: {
            validator: (items: OrderItem[]) => items.length > 0,
            message: 'An order must contain at least one product',
        }
    })
    items: OrderItem[];

    @Prop({ required: true, min: 0 })
    totalAmount: number;

    @Prop({
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    })
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);