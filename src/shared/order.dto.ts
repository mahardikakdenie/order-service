// shared/dto/order.dto.ts
export interface OrderCreatedEvent {
  orderId: number;
  customerEmail: string;
  product: { name: string; price: number; status: string }; // Added status field
}
