import { Module } from '@nestjs/common';
import { OrderController } from './app.controller';
import { AppService } from './app.service';
import { RmqService } from './rmq.service';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [AppService, RmqService],
})
export class AppModule {}
