import api from "@/lib/api";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<{
      success: boolean;
      data: AuthResponse;
      timestamp: string;
    }>("/auth/login", data);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<{
      success: boolean;
      data: AuthResponse;
      timestamp: string;
    }>("/auth/register", data);
    return response.data.data;
  },

  async getProfile() {
    const response = await api.get("/users/me");
    return response.data.data;
  },
};
