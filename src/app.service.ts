import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/orders.entity';
import { RmqService } from './rmq.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Order)
    private OrderRepository: Repository<Order>,
    private readonly rmqService: RmqService,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.OrderRepository.find();
  }

  async createOrder(data: {
    customerEmail: string;
    products: { name: string; price: number; status?: string }[];
  }): Promise<string> {
    for (const product of data.products) {
      const order = new Order();
      order.customerEmail = data.customerEmail;
      // order.productName = product.name;
      // order.productPrice = product.price;
      order.status = product.status || 'Pending';

      // ✅ Simpan ke database dulu
      const savedOrder = await this.OrderRepository.save(order);

      // ✅ Sekarang `savedOrder.id` sudah ada
      this.rmqService.publish('order_created', '', {
        pattern: 'order_created',
        data: {
          orderId: savedOrder.id, // ✅ Sekarang id tidak undefined
          customerEmail: savedOrder.customerEmail,
          product: {
            // name: savedOrder.productName,
            // price: savedOrder.productPrice,
            status: savedOrder.status,
          },
        },
      });
    }

    return 'Orders created and events published.';
  }
}
