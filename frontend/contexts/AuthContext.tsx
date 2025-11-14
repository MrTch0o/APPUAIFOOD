"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { User, LoginRequest, RegisterRequest } from "@/types";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  async function loadUserFromStorage() {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (
        token &&
        storedUser &&
        storedUser !== "undefined" &&
        storedUser !== "null"
      ) {
        setUser(JSON.parse(storedUser));
        // Validar token com o backend
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          // Token inválido, limpar
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(data: LoginRequest) {
    const response = await authService.login(data);
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  }

  async function register(data: RegisterRequest) {
    const response = await authService.register(data);
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
