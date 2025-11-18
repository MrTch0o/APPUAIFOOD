import api from "@/lib/api";
import { Address } from "@/types";

export const addressService = {
  async getAll(): Promise<Address[]> {
    const response = await api.get<any>("/addresses");
    // Handle both direct return and wrapped response
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<Address> {
    const response = await api.get<any>(`/addresses/${id}`);
    const data = response.data.data || response.data;
    return data;
  },

  async create(
    data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Address> {
    const response = await api.post<any>("/addresses", data);
    // Handle response structure from backend
    const responseData = response.data.data || response.data;
    return responseData.address || responseData;
  },

  async update(id: string, data: Partial<Address>): Promise<Address> {
    const response = await api.patch<any>(`/addresses/${id}`, data);
    const responseData = response.data.data || response.data;
    return responseData.address || responseData;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },
};
