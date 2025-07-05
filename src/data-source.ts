import { DataSource } from 'typeorm';
import { join } from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'dika9232',
  database: 'restaurants',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: true,
});

export default AppDataSource;
