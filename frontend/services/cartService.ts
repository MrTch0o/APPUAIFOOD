import api from "@/lib/api";
import { Cart, CartItem } from "@/types";

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<any>("/cart");
    // Handle both direct return and wrapped response
    const data = response.data.data || response.data;
    return data;
  },

  async addItem(productId: string, quantity: number = 1): Promise<CartItem> {
    const response = await api.post<any>("/cart/items", {
      productId,
      quantity,
    });
    const data = response.data.data || response.data;
    return data;
  },

  async updateItem(itemId: string, quantity: number): Promise<CartItem> {
    const response = await api.patch<any>(`/cart/items/${itemId}`, {
      quantity,
    });
    const data = response.data.data || response.data;
    return data;
  },

  async removeItem(itemId: string): Promise<void> {
    await api.delete(`/cart/items/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete("/cart");
  },
};
