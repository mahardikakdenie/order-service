import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/orders.entity';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { RmqService } from './rmq.service';
import type { ResponseInterface } from '../../shared/libs/response.interface';

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
  }): Promise<ResponseInterface<Order[]>> {
    const products = await this.productRepository.findByIds(data.productIds); // ✅ Ambil semua produk berdasarkan ID
    const result: ResponseInterface<Order[]> = {
      meta: {
        status: true,
        code: 200,
        message: 'success',
      },
      data: [],
    };

    if (products.length === 0) {
      result.meta = {
        status: false,
        code: 404,
        message: 'No products found for the provided product IDs',
      };
    }

    const savedOrders: Order[] = [];

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

      savedOrders.push(savedOrder);
    }

    result.data = savedOrders;
    return result;
  }

  async trackOrders(orderId: number): Promise<ResponseInterface<Order[]>> {
    const result: ResponseInterface<Order[]> = {
      meta: {
        status: true,
        code: 200,
        message: 'success',
      },
      data: [],
    };
    try {
      if (!orderId) {
        result.meta = {
          code: 404,
          status: false,
          message: 'orderid is required',
        };
      }

      const orders = await this.orderRepository.find({
        where: { id: orderId },
        relations: ['product'],
      });

      if (!orders.length) {
        result.meta = {
          code: 404,
          status: false,
          message: 'No orders found for this orderid',
        };
      }

      result.data = orders;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        result.meta = {
          code: 404,
          status: false,
          message: error.message,
        };
      }

      result.meta = {
        code: 501,
        status: false,
        message: 'Something went wrong while fetching orders',
      };
    }

    return result;
  }
}
