import api from "@/lib/api";

export interface AdminProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  productCategoryId: string;
  restaurantId: string;
  restaurant?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  preparationTime?: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  restaurantId: string;
  productCategoryId: string;
  preparationTime?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  restaurantId?: string;
  productCategoryId?: string;
  preparationTime?: number;
  isActive?: boolean;
}

export const productAdminService = {
  /**
   * Criar novo produto (apenas ADMIN)
   * POST /products
   */
  async create(data: CreateProductRequest): Promise<AdminProductResponse> {
    const response = await api.post<{
      success: boolean;
      data: {
        message: string;
        product: AdminProductResponse;
      };
      timestamp: string;
    }>("/products", data);
    return response.data.data.product;
  },

  /**
   * Listar todos os produtos (apenas ADMIN)
   * GET /products/admin/list
   */
  async getAllProducts(): Promise<AdminProductResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: AdminProductResponse[];
      timestamp: string;
    }>("/products/admin/list");
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Listar produtos por restaurante (apenas ADMIN)
   * GET /products/admin/restaurant/:restaurantId
   */
  async getProductsByRestaurant(
    restaurantId: string
  ): Promise<AdminProductResponse[]> {
    const response = await api.get<{
      success: boolean;
      data: AdminProductResponse[];
      timestamp: string;
    }>(`/products/admin/restaurant/${restaurantId}`);
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Buscar produto por ID (apenas ADMIN)
   * GET /products/admin/:id
   */
  async getProductById(id: string): Promise<AdminProductResponse> {
    const response = await api.get<{
      success: boolean;
      data: AdminProductResponse;
      timestamp: string;
    }>(`/products/admin/${id}`);
    return response.data.data;
  },

  /**
   * Atualizar produto (apenas ADMIN)
   * PATCH /products/:id
   */
  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<AdminProductResponse> {
    const response = await api.patch<{
      success: boolean;
      data: AdminProductResponse;
      timestamp: string;
    }>(`/products/${id}`, data);
    return response.data.data;
  },

  /**
   * Upload de imagem do produto
   * POST /products/:id/image
   */
  async uploadImage(id: string, file: File): Promise<AdminProductResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<{
      success: boolean;
      data: AdminProductResponse;
      timestamp: string;
    }>(`/products/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  /**
   * Desativar produto (apenas ADMIN)
   * PATCH /products/:id/deactivate
   */
  async deactivateProduct(id: string): Promise<{
    message: string;
    product: AdminProductResponse;
  }> {
    const response = await api.patch<{
      success: boolean;
      data: AdminProductResponse;
      timestamp: string;
    }>(`/products/${id}/deactivate`, {});
    return {
      message: "Produto desativado com sucesso",
      product: response.data.data,
    };
  },

  /**
   * Ativar produto (apenas ADMIN)
   * PATCH /products/:id/activate
   */
  async activateProduct(id: string): Promise<{
    message: string;
    product: AdminProductResponse;
  }> {
    const response = await api.patch<{
      success: boolean;
      data: AdminProductResponse;
      timestamp: string;
    }>(`/products/${id}/activate`, {});
    return {
      message: "Produto ativado com sucesso",
      product: response.data.data,
    };
  },

  /**
   * Deletar produto (apenas ADMIN)
   * DELETE /products/:id
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await api.delete<{
      success: boolean;
      data: { message: string };
      timestamp: string;
    }>(`/products/${id}`);
    return response.data.data;
  },
};
