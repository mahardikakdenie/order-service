// shared/dto/order.dto.ts
export interface OrderCreatedEvent {
  orderId: number;
  customerEmail: string;
  productIds: number[]; // Added status field
}
