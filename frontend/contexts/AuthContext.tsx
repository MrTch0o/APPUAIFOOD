"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { logger } from "@/lib/logger";
import { User, LoginRequest, RegisterRequest } from "@/types";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

        // Validar token com o backend com timeout de 5 segundos
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Timeout na validação de token")),
              5000
            )
          );

          const profile = await Promise.race([
            authService.getProfile(),
            timeoutPromise,
          ]);

          logger.info("Token validado com sucesso");
          setUser(profile);
        } catch {
          // Token inválido ou backend indisponível, limpar
          logger.warn(
            "Token inválido ou servidor indisponível, removendo dados de sessão"
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    } catch (error) {
      logger.error("Erro ao carregar usuário do storage", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(data: LoginRequest) {
    try {
      logger.info("Iniciando login", { email: data.email });
      const response = await authService.login(data);
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      logger.info("Login realizado com sucesso", {
        userName: response.data.user.name,
      });
    } catch (error) {
      logger.error("Erro ao fazer login", error);
      throw error;
    }
  }

  async function register(data: RegisterRequest) {
    try {
      logger.info("Iniciando registro", { name: data.name, email: data.email });
      const response = await authService.register(data);
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      logger.info("Registro realizado com sucesso", {
        userName: response.data.user.name,
      });
    } catch (error) {
      logger.error("Erro ao fazer registro", error);
      throw error;
    }
  }

  function logout() {
    logger.info("Usuário fazendo logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  function updateUser(userData: Partial<User>) {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      logger.info("Usuário atualizado no context", userData);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
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
