import api from "@/lib/api";
import { User } from "@/types";

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<{ data: User }>("/users/me");
    return response.data.data;
  },

  async updateProfile(data: UpdateUserRequest): Promise<{
    message: string;
    user: User;
  }> {
    const response = await api.patch<{
      data: {
        message: string;
        user: User;
      };
    }>("/users/me", data);
    return response.data.data;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const response = await api.delete<{
      data: { message: string };
    }>("/users/me");
    return response.data.data;
  },
};
