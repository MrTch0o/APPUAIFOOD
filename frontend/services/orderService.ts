import api from "@/lib/api";
import { Order, PaymentMethod } from "@/types";

interface CreateOrderData {
  addressId: string;
  paymentMethod: PaymentMethod;
  restaurantId: string;
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    const response = await api.get<Order[]>("/orders");
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post<Order>("/orders", data);
    return response.data;
  },

  async cancel(id: string): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};
