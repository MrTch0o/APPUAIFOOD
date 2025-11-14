import api from "@/lib/api";
import { Restaurant } from "@/types";

export const restaurantService = {
  /**
   * Listar todos os restaurantes ativos
   * GET /restaurants
   */
  async getAll(): Promise<Restaurant[]> {
    const response = await api.get<{
      success: boolean;
      data: Restaurant[];
      timestamp: string;
    }>("/restaurants");
    return response.data.data;
  },

  /**
   * Buscar detalhes de um restaurante específico
   * GET /restaurants/:id
   */
  async getById(id: string): Promise<Restaurant> {
    const response = await api.get<{
      success: boolean;
      data: Restaurant;
      timestamp: string;
    }>(`/restaurants/${id}`);
    return response.data.data;
  },
};
