import api from "@/lib/api";
import { User } from "@/types";

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: "CLIENT" | "RESTAURANT_OWNER" | "ADMIN";
}

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "CLIENT" | "RESTAURANT_OWNER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

  /**
   * Listar todos os usuários (ADMIN only)
   */
  async getAllUsers(): Promise<AdminUserResponse[]> {
    const response = await api.get<{
      data: AdminUserResponse[];
    }>("/users");
    return response.data.data;
  },

  /**
   * Buscar usuário por ID (ADMIN only)
   */
  async getUserById(id: string): Promise<AdminUserResponse> {
    const response = await api.get<{
      data: AdminUserResponse;
    }>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Atualizar usuário (ADMIN only)
   */
  async updateUser(
    id: string,
    data: UpdateUserRequest
  ): Promise<{ message: string; user: AdminUserResponse }> {
    const response = await api.patch<{
      data: {
        message: string;
        user: AdminUserResponse;
      };
    }>(`/users/${id}`, data);
    return response.data.data;
  },

  /**
   * Mudar role do usuário (ADMIN only)
   */
  async updateUserRole(
    id: string,
    role: "CLIENT" | "RESTAURANT_OWNER" | "ADMIN"
  ): Promise<{ message: string; user: AdminUserResponse }> {
    const response = await api.patch<{
      data: {
        message: string;
        user: AdminUserResponse;
      };
    }>(`/users/${id}/role`, { role });
    return response.data.data;
  },

  /**
   * Desativar usuário (ADMIN only)
   */
  async deactivateUser(id: string): Promise<{
    message: string;
    user: AdminUserResponse;
  }> {
    const response = await api.patch<{
      data: {
        message: string;
        user: AdminUserResponse;
      };
    }>(`/users/${id}/deactivate`, {});
    return response.data.data;
  },

  /**
   * Ativar usuário (ADMIN only)
   */
  async activateUser(id: string): Promise<{
    message: string;
    user: AdminUserResponse;
  }> {
    const response = await api.patch<{
      data: {
        message: string;
        user: AdminUserResponse;
      };
    }>(`/users/${id}/activate`, {});
    return response.data.data;
  },

  /**
   * Criar novo usuário (ADMIN only)
   */
  async createUser(
    data: CreateUserRequest
  ): Promise<{ message: string; user: AdminUserResponse }> {
    const response = await api.post<{
      data: {
        message: string;
        user: AdminUserResponse;
      };
    }>(`/users`, data);
    return response.data.data;
  },

  /**
   * Mudar a senha do usuário logado
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string; user: User }> {
    const response = await api.patch<{
      data: {
        message: string;
        user: User;
      };
    }>(`/users/me/change-password`, {
      currentPassword,
      newPassword,
    });
    return response.data.data;
  },

  /**
   * Resetar a senha de um usuário (ADMIN only)
   */
  async resetPassword(
    id: string,
    newPassword: string
  ): Promise<{ message: string; user: AdminUserResponse }> {
    const response = await api.patch<{
      data: {
        message: string;
        user: AdminUserResponse;
      };
    }>(`/users/${id}/reset-password`, {
      newPassword,
    });
    return response.data.data;
  },
};
