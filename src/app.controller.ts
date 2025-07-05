import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OrderCreatedEvent } from '../../shared/order.dto';
import { RmqService } from './rmq.service';
import { AppService } from './app.service';
import { TransformerResponse } from './commons/decorators/response.decorator';
import { Order } from './entity/orders.entity';

@Controller()
export class OrderController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly appService: AppService,
  ) {}

  @Post('orders')
  createOrder(
    @TransformerResponse()
    res: {
      success(orderDetails: OrderCreatedEvent, arg1: string): unknown;
      orderId: number;
      status: string;
    },
    @Body()
    body: {
      email: string;
      productIds: number[];
    },
  ) {
    const orderDetails: OrderCreatedEvent = {
      orderId: Date.now(),
      customerEmail: body.email,
      productIds: body.productIds,
    };

    this.appService.createOrder({
      customerEmail: body.email,
      productIds: body.productIds,
    });
    return res.success(orderDetails, 'Order created');
  }

  @Get('track/orders')
  async trackOrder(
    @Query('email') email: string,
    @TransformerResponse()
    res: {
      success(data: Order[], arg1: string): unknown;
      data: Order[];
    },
  ) {
    const data = await this.appService.trackOrders(email);
    return res.success(data, 'Orders retrieved successfully');
  }

  @Get('products')
  getProducts() {}
}
