import { Controller, Post, Body } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { ClientProxyFactory } from '@nestjs/microservices/client';
// import { Transport } from '@nestjs/microservices/enums';
import { OrderCreatedEvent } from './shared/order.dto';
import { RmqService } from './rmq.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly rmqService: RmqService) {}

  @Post()
  createOrder(
    @Body()
    body: {
      email: string;
      product: { name: string; price: string; status: string };
    },
  ) {
    const orderDetails: OrderCreatedEvent = {
      orderId: Date.now(),
      customerEmail: body.email,
      product: {
        name: String(body.product.name),
        price: Number(body.product.price),
        status: String(body.product.status), // Default status
      },
    };

    // 👇 Kirim ke exchange
    this.rmqService.publish('order_created', '', {
      pattern: 'order_created',
      data: orderDetails,
    });

    return {
      status: 'Order created and event published',
      orderId: orderDetails.orderId,
      data: orderDetails.product,
    };
  }
}

// @Controller('orders')
// export class OrderController {
//   private rabbitClient: ClientProxy;

//   constructor() {
//     this.rabbitClient = ClientProxyFactory.create({
//       transport: Transport.RMQ,
//       options: {
//         urls: ['amqp://guest:guest@localhost:5672'],
//         queue: 'order_created', // queue tetap diperlukan sebagai fallback
//         noAck: false,
//         queueOptions: {
//           exclusive: false,
//           durable: false,
//         },
//         prefetchCount: 1,
//         isGlobalPrefetchCount: true,
//       },
//     });
//   }

//   @Post()
//   createOrder(@Body() body: { email: string; items: any[] }) {
//     const orderDetails: OrderCreatedEvent = {
//       orderId: Date.now(),
//       customerEmail: body.email,
//       items: (body.items || []).map(
//         (item: { name: string; price: number }) => ({
//           name: String(item.name),
//           price: Number(item.price),
//         }),
//       ),
//     };

//     this.rabbitClient.emit('order_created', orderDetails);
//     return { status: 'Order created', orderId: orderDetails.orderId };
//   }
// }
