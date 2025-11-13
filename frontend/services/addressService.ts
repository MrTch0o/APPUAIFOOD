import api from "@/lib/api";
import { Address } from "@/types";

export const addressService = {
  async getAll(): Promise<Address[]> {
    const response = await api.get<Address[]>("/addresses");
    return response.data;
  },

  async getById(id: string): Promise<Address> {
    const response = await api.get<Address>(`/addresses/${id}`);
    return response.data;
  },

  async create(
    data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Address> {
    const response = await api.post<Address>("/addresses", data);
    return response.data;
  },

  async update(id: string, data: Partial<Address>): Promise<Address> {
    const response = await api.patch<Address>(`/addresses/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },
};
