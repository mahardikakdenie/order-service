import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { RmqService } from './rmq.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, // 👈 Tambahkan repo produk

    private readonly rmqService: RmqService,
  ) {}

  async createOrder(data: {
    customerEmail: string;
    productIds: number[];
  }): Promise<any> {
    const products = await this.productRepository.findByIds(data.productIds); // ✅ Ambil semua produk berdasarkan ID

    if (products.length === 0) {
      throw new Error('Produk tidak ditemukan');
    }

    for (const product of products) {
      const order = new Order();
      order.customerEmail = data.customerEmail;
      order.status = 'pending';
      order.productId = product.id;

      const savedOrder = await this.orderRepository.save(order);

      // send event to RabbitMQ
      this.rmqService.publish('order_created', '', {
        pattern: 'order_created',
        data: {
          orderId: savedOrder.id,
          customerEmail: savedOrder.customerEmail,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
          },
        },
      });
    }

    return 'Orders created and events published.';
  }

  async trackOrders(customerEmail: string): Promise<Order[]> {
    try {
      const orders = await this.orderRepository.find({
        where: { customerEmail },
        relations: ['product'],
      });

      return orders;
    } catch (error: any) {
      throw new Error(`Failed to fetch orders: ${error}`);
    }
  }
}
