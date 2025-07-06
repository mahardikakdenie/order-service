import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { AppService } from './app.service';
import { TransformerResponse } from './commons/decorators/response.decorator';
import { Order } from './entity/orders.entity';
import {
  ResponseInterface,
  ResponseMeta,
} from './shared/libs/response.interface';

@Controller()
export class OrderController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly appService: AppService,
  ) {}

  @Post('orders')
  async createOrder(
    @TransformerResponse()
    res: {
      success(data: Order[], arg1: string, meta?: ResponseMeta): unknown;
      orderId: number;
      status: string;
    },
    @Body()
    body: {
      email: string;
      productIds: number[];
    },
  ) {
    const result: ResponseInterface<Order[]> =
      await this.appService.createOrder({
        customerEmail: body.email,
        productIds: body.productIds,
      });
    return res.success(result.data || [], 'Order created', result.meta);
  }

  @Get('track/orders/:orderId')
  async trackOrder(
    @Param('orderId') orderId: number,
    @TransformerResponse()
    res: {
      success(
        data: Order[] | undefined,
        message: string,
        meta: ResponseMeta,
      ): unknown;
      error(error: any, message: string): unknown;
    },
  ) {
    const data = await this.appService.trackOrders(orderId);
    return res.success(data.data, data.meta.message, data.meta);
  }

  @Get('products')
  getProducts() {}
}
