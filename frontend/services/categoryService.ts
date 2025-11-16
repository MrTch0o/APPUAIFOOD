import api from "@/lib/api";

export interface RestaurantCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const restaurantCategoryService = {
  async getAll(onlyActive = false) {
    try {
      const response = await api.get<{
        success: boolean;
        data: RestaurantCategory[];
        timestamp: string;
      }>(`/restaurant-categories`, {
        params: { active: onlyActive },
      });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar categorias de restaurante:", error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await api.get<{
        success: boolean;
        data: RestaurantCategory;
        timestamp: string;
      }>(`/restaurant-categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      throw error;
    }
  },

  async create(
    data: Omit<RestaurantCategory, "id" | "createdAt" | "updatedAt">
  ) {
    try {
      const response = await api.post<{
        success: boolean;
        data: RestaurantCategory;
        timestamp: string;
      }>(`/restaurant-categories`, data);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
  },

  async update(
    id: string,
    data: Partial<Omit<RestaurantCategory, "id" | "createdAt" | "updatedAt">>
  ) {
    try {
      const response = await api.patch<{
        success: boolean;
        data: RestaurantCategory;
        timestamp: string;
      }>(`/restaurant-categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await api.delete(`/restaurant-categories/${id}`);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      throw error;
    }
  },

  async activate(id: string) {
    try {
      const response = await api.patch<{
        success: boolean;
        data: RestaurantCategory;
        timestamp: string;
      }>(`/restaurant-categories/${id}/activate`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao ativar categoria:", error);
      throw error;
    }
  },

  async deactivate(id: string) {
    try {
      const response = await api.patch<{
        success: boolean;
        data: RestaurantCategory;
        timestamp: string;
      }>(`/restaurant-categories/${id}/deactivate`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao desativar categoria:", error);
      throw error;
    }
  },
};

export const productCategoryService = {
  async getAll(onlyActive = false) {
    try {
      const response = await api.get<{
        success: boolean;
        data: ProductCategory[];
        timestamp: string;
      }>(`/product-categories`, {
        params: { active: onlyActive },
      });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar categorias de produto:", error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await api.get<{
        success: boolean;
        data: ProductCategory;
        timestamp: string;
      }>(`/product-categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      throw error;
    }
  },

  async create(data: Omit<ProductCategory, "id" | "createdAt" | "updatedAt">) {
    try {
      const response = await api.post<{
        success: boolean;
        data: ProductCategory;
        timestamp: string;
      }>(`/product-categories`, data);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
  },

  async update(
    id: string,
    data: Partial<Omit<ProductCategory, "id" | "createdAt" | "updatedAt">>
  ) {
    try {
      const response = await api.patch<{
        success: boolean;
        data: ProductCategory;
        timestamp: string;
      }>(`/product-categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await api.delete(`/product-categories/${id}`);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      throw error;
    }
  },

  async activate(id: string) {
    try {
      const response = await api.patch<{
        success: boolean;
        data: ProductCategory;
        timestamp: string;
      }>(`/product-categories/${id}/activate`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao ativar categoria:", error);
      throw error;
    }
  },

  async deactivate(id: string) {
    try {
      const response = await api.patch<{
        success: boolean;
        data: ProductCategory;
        timestamp: string;
      }>(`/product-categories/${id}/deactivate`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao desativar categoria:", error);
      throw error;
    }
  },
};
