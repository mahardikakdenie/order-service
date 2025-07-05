import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerEmail: string;

  @Column({ default: 'Pending' })
  status: string;

  // Relasi ke Product (Many-to-One)
  @ManyToOne(() => Product)
  product: Product;

  @Column()
  productId: number; // Foreign key

  @CreateDateColumn()
  createdAt: Date;
}
