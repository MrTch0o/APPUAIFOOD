import api from "@/lib/api";
import { Restaurant } from "@/types";

export interface CreateRestaurantRequest {
  name: string;
  description: string;
  address: string;
  phone: string;
  category: string;
  deliveryFee: number;
  deliveryTime: string;
  minimumOrder?: number;
  openingHours?: Record<string, string>;
}

export interface UpdateRestaurantRequest {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  category?: string;
  deliveryFee?: number;
  deliveryTime?: string;
  minimumOrder?: number;
  openingHours?: Record<string, string>;
}

export const restaurantAdminService = {
  /**
   * Criar novo restaurante (apenas ADMIN)
   * POST /restaurants
   */
  async create(data: CreateRestaurantRequest): Promise<Restaurant> {
    const response = await api.post<{
      success: boolean;
      data: Restaurant;
      timestamp: string;
    }>("/restaurants", data);
    return response.data.data;
  },

  /**
   * Atualizar restaurante do usuário logado
   * PATCH /restaurants/:id
   */
  async update(id: string, data: UpdateRestaurantRequest): Promise<Restaurant> {
    const response = await api.patch<{
      success: boolean;
      data: Restaurant;
      timestamp: string;
    }>(`/restaurants/${id}`, data);
    return response.data.data;
  },

  /**
   * Obter restaurante do usuário logado
   * GET /restaurants/me
   */
  async getMyRestaurant(): Promise<Restaurant> {
    const response = await api.get<{
      success: boolean;
      data: {
        message: string;
        restaurant: Restaurant;
      };
      timestamp: string;
    }>("/restaurants/me");
    return response.data.data.restaurant;
  },

  /**
   * Upload de imagem do restaurante
   * POST /restaurants/:id/image
   */
  async uploadImage(id: string, file: File): Promise<Restaurant> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<{
      success: boolean;
      data: Restaurant;
      timestamp: string;
    }>(`/restaurants/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
};
