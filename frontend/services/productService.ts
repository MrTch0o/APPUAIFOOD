import api from "@/lib/api";
import { Product } from "@/types";

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  restaurantId: string;
  productCategoryId: string;
  image?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  productCategoryId?: string;
  image?: string;
}

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

  /**
   * Criar novo produto (ADMIN)
   * POST /products
   */
  async create(data: CreateProductRequest): Promise<Product> {
    const response = await api.post<{
      success: boolean;
      data: Product;
      timestamp: string;
    }>("/products", data);
    return response.data.data;
  },

  /**
   * Atualizar produto (ADMIN)
   * PATCH /products/:id
   */
  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    const response = await api.patch<{
      success: boolean;
      data: Product;
      timestamp: string;
    }>(`/products/${id}`, data);
    return response.data.data;
  },

  /**
   * Deletar produto (ADMIN)
   * DELETE /products/:id
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  /**
   * Upload de imagem para produto (ADMIN)
   * POST /products/:id/image
   */
  async uploadImage(id: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{
      success: boolean;
      data: { imageUrl: string };
      timestamp: string;
    }>(`/products/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.imageUrl;
  },
};
