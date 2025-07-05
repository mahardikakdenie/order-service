import { Controller, Post, Body } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { ClientProxyFactory } from '@nestjs/microservices/client';
// import { Transport } from '@nestjs/microservices/enums';
import { OrderCreatedEvent } from '../../shared/order.dto';
import { RmqService } from './rmq.service';
import { AppService } from './app.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly appService: AppService,
  ) {}

  @Post()
  createOrder(
    @Body()
    body: {
      email: string;
      products: { name: string; price: string; status: string }[];
    },
  ) {
    const orderDetails: OrderCreatedEvent = {
      orderId: Date.now(),
      customerEmail: body.email,
      products: body.products,
    };

    this.appService.createOrder({
      customerEmail: body.email,
      products: body.products.map((product) => {
        return {
          name: product.name,
          price: parseFloat(product.price),
          status: product.status || 'pending', // Default status to 'pending'
        };
      }),
    });

    return {
      status: 'Order created and event published',
      orderId: orderDetails.orderId,
    };
  }
}
