import api from "@/lib/api";
import { Restaurant } from "@/types";

export interface AdminRestaurantResponse {
  id: string;
  name: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  description?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  deliveryFee?: number;
  deliveryTime?: number;
  minimumOrder?: number;
  category?: string;
  image?: string;
  isActive: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateRestaurantRequest {
  name: string;
  description: string;
  address: string;
  phone: string;
  restaurantCategoryId: string;
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
  restaurantCategoryId?: string;
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
  async create(
    data: CreateRestaurantRequest
  ): Promise<AdminRestaurantResponse> {
    const response = await api.post<{
      success: boolean;
      data: AdminRestaurantResponse;
      timestamp: string;
    }>("/restaurants", data);
    return response.data.data;
  },

  /**
   * Atualizar restaurante do usuário logado
   * PATCH /restaurants/:id
   */
  async update(
    id: string,
    data: UpdateRestaurantRequest
  ): Promise<AdminRestaurantResponse> {
    const response = await api.patch<{
      success: boolean;
      data: AdminRestaurantResponse;
      timestamp: string;
    }>(`/restaurants/${id}`, data);
    return response.data.data;
  },

  /**
   * Listar todos os restaurantes (apenas ADMIN)
   * GET /restaurants/admin/list
   */
  async getAllRestaurants(): Promise<AdminRestaurantResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: AdminRestaurantResponse[];
      timestamp: string;
    }>("/restaurants/admin/list");
    return response.data.data;
  },

  /**
   * Buscar restaurante por ID (apenas ADMIN)
   * GET /restaurants/:id
   */
  async getRestaurantById(id: string): Promise<AdminRestaurantResponse> {
    const response = await api.get<{
      success: boolean;
      data: AdminRestaurantResponse;
      timestamp: string;
    }>(`/restaurants/${id}`);
    return response.data.data;
  },

  /**
   * Atualizar restaurante (apenas ADMIN)
   * PATCH /restaurants/:id
   */
  async updateRestaurant(
    id: string,
    data: UpdateRestaurantRequest
  ): Promise<AdminRestaurantResponse> {
    const response = await api.patch<{
      success: boolean;
      data: AdminRestaurantResponse;
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
  async uploadImage(id: string, file: File): Promise<AdminRestaurantResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<{
      success: boolean;
      data: AdminRestaurantResponse;
      timestamp: string;
    }>(`/restaurants/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  /**
   * Desativar restaurante (apenas ADMIN)
   * PATCH /restaurants/:id/deactivate
   */
  async deactivateRestaurant(id: string): Promise<{
    message: string;
    restaurant: AdminRestaurantResponse;
  }> {
    const response = await api.patch<{
      success: boolean;
      data: AdminRestaurantResponse;
      timestamp: string;
    }>(`/restaurants/${id}/deactivate`, {});
    return {
      message: "Restaurante desativado com sucesso",
      restaurant: response.data.data,
    };
  },

  /**
   * Ativar restaurante (apenas ADMIN)
   * PATCH /restaurants/:id/activate
   */
  async activateRestaurant(id: string): Promise<{
    message: string;
    restaurant: AdminRestaurantResponse;
  }> {
    const response = await api.patch<{
      success: boolean;
      data: AdminRestaurantResponse;
      timestamp: string;
    }>(`/restaurants/${id}/activate`, {});
    return {
      message: "Restaurante ativado com sucesso",
      restaurant: response.data.data,
    };
  },
};
