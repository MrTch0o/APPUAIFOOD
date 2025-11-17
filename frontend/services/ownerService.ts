import api from "@/lib/api";

export interface OwnerRestaurantResponse {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  openingHours?: Record<string, string | string[]> | null;
  deliveryFee?: number;
  deliveryTime?: number;
  minimumOrder?: number;
  restaurantCategoryId?: string;
  image?: string;
  isActive: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface OwnerOrderResponse {
  id: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  userId: string;
  restaurantId: string;
  addressId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OwnerProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  productCategoryId: string;
  restaurantId: string;
  isActive: boolean;
  preparationTime?: number;
  createdAt: string;
  updatedAt: string | null;
}

export const ownerService = {
  /**
   * Obter todos os restaurantes do proprietário logado
   */
  async getMyRestaurants(): Promise<OwnerRestaurantResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: OwnerRestaurantResponse[];
      timestamp: string;
    }>("/restaurants/owner/my-restaurants");
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obter detalhes de um restaurante específico do proprietário
   */
  async getMyRestaurantById(id: string): Promise<OwnerRestaurantResponse> {
    const response = await api.get<{
      success: boolean;
      data: OwnerRestaurantResponse;
      timestamp: string;
    }>(`/restaurants/owner/${id}`);
    return response.data.data;
  },

  /**
   * Obter todos os pedidos de um restaurante do proprietário
   */
  async getRestaurantOrders(
    restaurantId: string,
    status?: string
  ): Promise<OwnerOrderResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: OwnerOrderResponse[];
      timestamp: string;
    }>(`/orders/restaurant/${restaurantId}`, {
      params: status ? { status } : {},
    });
    return response.data.data;
  },

  /**
   * Atualizar status de um pedido
   */
  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<OwnerOrderResponse> {
    const response = await api.patch<{
      success: boolean;
      data: OwnerOrderResponse;
      timestamp: string;
    }>(`/orders/${orderId}/status`, { status });
    return response.data.data;
  },

  /**
   * Obter produtos de um restaurante do proprietário
   */
  async getRestaurantProducts(
    restaurantId: string
  ): Promise<OwnerProductResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: OwnerProductResponse[];
      timestamp: string;
    }>(`/products`, {
      params: { restaurantId },
    });
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },
};
