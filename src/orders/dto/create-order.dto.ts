import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsMongoId, Min, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsMongoId()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsMongoId()
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}