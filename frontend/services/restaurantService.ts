import api from "@/lib/api";
import { Restaurant } from "@/types";

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const response = await api.get<Restaurant[]>("/restaurants");
    return response.data;
  },

  async getById(id: string): Promise<Restaurant> {
    const response = await api.get<Restaurant>(`/restaurants/${id}`);
    return response.data;
  },

  async getProducts(restaurantId: string) {
    const response = await api.get(`/restaurants/${restaurantId}/products`);
    return response.data;
  },
};
