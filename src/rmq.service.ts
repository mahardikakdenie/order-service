import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class RmqService {
  private connection: Connection;
  private channel: Channel;

  constructor() {
    void this.connect();
  }

  private async connect() {
    try {
      this.connection = await connect('amqp://guest:guest@localhost:5672');
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange('order_created', 'fanout', {
        durable: true,
      });
    } catch (rawError) {
      // ✅ Amanin error dengan type assertion ke Error
      const error = rawError as Error;

      // ✅ Log error dengan aman
      console.error('Failed to connect to RabbitMQ:', error.message);

      // ❌ JANGAN throw error langsung
      // ✅ Lebih baik lempar exception NestJS
      throw new InternalServerErrorException(`RabbitMQ connection failed`);
    }
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: any,
  ): Promise<boolean> {
    if (!this.channel) {
      throw new InternalServerErrorException(
        'RabbitMQ channel not initialized',
      );
    }

    return this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
  }
}
