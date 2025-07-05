import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);
  await dataSource.runMigrations(); // 👈 jalankan migrasi

  await app.listen(3000);
}
void bootstrap();
