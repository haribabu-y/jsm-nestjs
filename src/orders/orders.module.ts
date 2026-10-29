import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { User, UserSchema } from '../user/user.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports:  [
    MongooseModule.forFeature([
      {name: Order.name, schema: OrderSchema},
      {name: Product.name, schema: ProductSchema},
      {name: User.name, schema: UserSchema}
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
