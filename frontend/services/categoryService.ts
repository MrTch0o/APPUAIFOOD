import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
      const response = await axios.get<RestaurantCategory[]>(
        `${API_URL}/restaurant-categories`,
        {
          params: { active: onlyActive },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar categorias de restaurante:", error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await axios.get<RestaurantCategory>(
        `${API_URL}/restaurant-categories/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      throw error;
    }
  },

  async create(
    data: Omit<RestaurantCategory, "id" | "createdAt" | "updatedAt">
  ) {
    try {
      const response = await axios.post<RestaurantCategory>(
        `${API_URL}/restaurant-categories`,
        data
      );
      return response.data;
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
      const response = await axios.patch<RestaurantCategory>(
        `${API_URL}/restaurant-categories/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await axios.delete(`${API_URL}/restaurant-categories/${id}`);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      throw error;
    }
  },

  async activate(id: string) {
    try {
      const response = await axios.patch<RestaurantCategory>(
        `${API_URL}/restaurant-categories/${id}/activate`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao ativar categoria:", error);
      throw error;
    }
  },

  async deactivate(id: string) {
    try {
      const response = await axios.patch<RestaurantCategory>(
        `${API_URL}/restaurant-categories/${id}/deactivate`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao desativar categoria:", error);
      throw error;
    }
  },
};

export const productCategoryService = {
  async getAll(onlyActive = false) {
    try {
      const response = await axios.get<ProductCategory[]>(
        `${API_URL}/product-categories`,
        {
          params: { active: onlyActive },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar categorias de produto:", error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await axios.get<ProductCategory>(
        `${API_URL}/product-categories/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      throw error;
    }
  },

  async create(data: Omit<ProductCategory, "id" | "createdAt" | "updatedAt">) {
    try {
      const response = await axios.post<ProductCategory>(
        `${API_URL}/product-categories`,
        data
      );
      return response.data;
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
      const response = await axios.patch<ProductCategory>(
        `${API_URL}/product-categories/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await axios.delete(`${API_URL}/product-categories/${id}`);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      throw error;
    }
  },

  async activate(id: string) {
    try {
      const response = await axios.patch<ProductCategory>(
        `${API_URL}/product-categories/${id}/activate`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao ativar categoria:", error);
      throw error;
    }
  },

  async deactivate(id: string) {
    try {
      const response = await axios.patch<ProductCategory>(
        `${API_URL}/product-categories/${id}/deactivate`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao desativar categoria:", error);
      throw error;
    }
  },
};
