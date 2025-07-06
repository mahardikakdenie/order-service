/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
    let retries = 5;

    while (retries) {
      try {
        const connection = await connect(
          process.env.RABBITMQ_URLS || 'amqp://guest:guest@localhost:5672',
        );
        if (!connection) {
          throw new InternalServerErrorException(
            'Failed to create RabbitMQ connection',
          );
        }

        this.connection = connection as Connection;

        const channel = await this.connection.createChannel();
        if (!channel) {
          throw new InternalServerErrorException(
            'Failed to create RabbitMQ channel',
          );
        }
        this.channel = channel as Channel;

        await this.channel.assertExchange(
          process.env.RABBITMQ_EXCHAGE || 'order_created',
          'fanout',
          {
            durable: true,
          },
        );
        console.log('Connected to RabbitMQ');
        return;
      } catch (error) {
        console.error(
          `Connection failed, retries left: ${retries}, error:`,
          error.message,
        );
        retries -= 1;
        await new Promise((res) => setTimeout(res, 5000));
      }
    }

    throw new InternalServerErrorException(
      'RabbitMQ connection failed after retries',
    );
  }

  publish(exchange: string, routingKey: string, message: any): boolean {
    if (!this.channel) {
      throw new InternalServerErrorException(
        'RabbitMQ channel not initialized',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
  }
}
