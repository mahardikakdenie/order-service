import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { OrderController } from './app.controller';
import { AppService } from './app.service';
import { RmqService } from './rmq.service';
import { Order } from './entity/orders.entity';
import { Product } from './entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'dika9232',
      database: 'restaurants',
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      migrations: [join(__dirname, 'migration/**/*{.ts,.js}')],
      migrationsTableName: 'typeorm_migrations',
      synchronize: false, // Harus false di production
      logging: true,
    }),
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [OrderController],
  providers: [AppService, RmqService],
})
export class AppModule {}
