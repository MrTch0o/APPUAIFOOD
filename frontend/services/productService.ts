import api from "@/lib/api";
import { Product } from "@/types";

export const productService = {
  /**
   * Listar todos os produtos com filtros opcionais
   * GET /products?restaurantId=:id&category=:category
   */
  async getAll(restaurantId?: string, category?: string): Promise<Product[]> {
    const response = await api.get<{
      success: boolean;
      data: Product[];
      timestamp: string;
    }>("/products", {
      params: {
        ...(restaurantId && { restaurantId }),
        ...(category && { category }),
      },
    });
    return response.data.data;
  },

  /**
   * Listar produtos de um restaurante específico
   * GET /products?restaurantId=:id
   */
  async getByRestaurantId(restaurantId: string): Promise<Product[]> {
    return this.getAll(restaurantId);
  },

  /**
   * Buscar detalhes de um produto específico
   * GET /products/:id
   */
  async getById(id: string): Promise<Product> {
    const response = await api.get<{
      success: boolean;
      data: Product;
      timestamp: string;
    }>(`/products/${id}`);
    return response.data.data;
  },

  /**
   * Listar produtos por categoria
   * GET /products?category=:category
   */
  async getByCategory(category: string): Promise<Product[]> {
    return this.getAll(undefined, category);
  },
};
