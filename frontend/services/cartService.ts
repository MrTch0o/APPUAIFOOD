import api from "@/lib/api";
import { Cart, CartItem } from "@/types";

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<Cart>("/cart");
    return response.data;
  },

  async addItem(productId: string, quantity: number = 1): Promise<CartItem> {
    const response = await api.post<CartItem>("/cart/items", {
      productId,
      quantity,
    });
    return response.data;
  },

  async updateItem(itemId: string, quantity: number): Promise<CartItem> {
    const response = await api.patch<CartItem>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  async removeItem(itemId: string): Promise<void> {
    await api.delete(`/cart/items/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete("/cart");
  },
};
