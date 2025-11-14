import api from "@/lib/api";
import { Restaurant } from "@/types";

export const restaurantService = {
  /**
   * Listar todos os restaurantes ativos
   * GET /restaurants
   */
  async getAll(): Promise<Restaurant[]> {
    const response = await api.get<Restaurant[]>("/restaurants");
    return response.data;
  },

  /**
   * Buscar detalhes de um restaurante específico
   * GET /restaurants/:id
   */
  async getById(id: string): Promise<Restaurant> {
    const response = await api.get<Restaurant>(`/restaurants/${id}`);
    return response.data;
  },
};
