export class Order {
  id: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  isPaid: boolean;
  paymentVerifiedAt?: Date;
  userId: string;
  restaurantId: string;
  addressId: string;
  createdAt: Date;
  updatedAt: Date;
}
