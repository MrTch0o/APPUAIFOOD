import api from "@/lib/api";
import { Order, PaymentMethod } from "@/types";

interface CreateOrderData {
  addressId: string;
  paymentMethod: PaymentMethod;
  restaurantId: string;
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    const response = await api.get<any>("/orders");
    // Handle both direct return and wrapped response
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<any>(`/orders/${id}`);
    const data = response.data.data || response.data;
    return data;
  },

  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post<any>("/orders", data);
    const responseData = response.data.data || response.data;
    return responseData;
  },

  async cancel(id: string): Promise<Order> {
    const response = await api.patch<any>(`/orders/${id}/status`, {
      status: "CANCELLED",
    });
    const responseData = response.data.data || response.data;
    return responseData;
  },
};
