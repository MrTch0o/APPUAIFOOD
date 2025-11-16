"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { userService, CreateUserRequest } from "@/services/userService";
import { logger } from "@/lib/logger";

export default function CreateUserPage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<CreateUserRequest>({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "CLIENT",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError("Email, senha e nome são obrigatórios");
      return false;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Email inválido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const createData: CreateUserRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        role:
          (formData.role as "CLIENT" | "RESTAURANT_OWNER" | "ADMIN") ||
          "CLIENT",
      };

      await userService.createUser(createData);
      setSuccess("Usuário criado com sucesso!");
      setTimeout(() => {
        router.push("/admin/usuarios");
      }, 2000);
    } catch (err) {
      logger.error("Erro ao criar usuário", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar usuário";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!authUser || authUser.role !== "ADMIN") {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="flex w-full max-w-2xl flex-col px-4">
              <header className="flex items-center justify-between border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 mb-6">
                <Link
                  href="/"
                  className="flex items-center gap-4 text-[#1b130d]"
                >
                  <h2 className="text-[#1b130d] text-lg font-bold">UAIFOOD</h2>
                </Link>
              </header>
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <p className="text-[#9a6c4c] mb-4">Acesso negado.</p>
                  <Link href="/">
                    <button className="px-6 py-2 bg-[#ee7c2b] text-white rounded-lg hover:bg-[#ee7c2b]/90">
                      Voltar
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="flex w-full max-w-2xl flex-col px-4">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 mb-6 bg-white rounded-lg">
              <h1 className="text-[#1b130d] text-2xl font-bold">
                Novo Usuário
              </h1>
              <Link href="/admin/usuarios">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#f3ece7] text-[#1b130d] rounded-lg hover:bg-[#e7d9cf] transition-colors font-medium">
                  <span className="material-symbols-outlined">arrow_back</span>
                  Voltar
                </button>
              </Link>
            </header>

            {/* Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            {/* Create User Form */}
            <div className="bg-white rounded-lg border border-[#e7d9cf] p-6">
              <h2 className="text-[#1b130d] text-lg font-bold mb-6">
                Preencha os dados do novo usuário
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="block text-[#1b130d] font-medium mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b] placeholder-[#9a6c4c] text-[#1b130d]"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#1b130d] font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ex: joao@example.com"
                    className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b] placeholder-[#9a6c4c] text-[#1b130d]"
                    required
                  />
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-[#1b130d] font-medium mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b] placeholder-[#9a6c4c] text-[#1b130d]"
                    required
                  />
                  <p className="text-xs text-[#9a6c4c] mt-1">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-[#1b130d] font-medium mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: (11) 98765-4321"
                    className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b] placeholder-[#9a6c4c] text-[#1b130d]"
                  />
                  <p className="text-xs text-[#9a6c4c] mt-1">Opcional</p>
                </div>

                {/* Papel */}
                <div>
                  <label className="block text-[#1b130d] font-medium mb-2">
                    Papel
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b]"
                  >
                    <option value="CLIENT">Cliente</option>
                    <option value="RESTAURANT_OWNER">
                      Proprietário de Restaurante
                    </option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                  <p className="text-xs text-[#9a6c4c] mt-1">
                    Selecione o papel do usuário no sistema
                  </p>
                </div>

                {/* Buttons */}
                <div className="pt-6 border-t border-[#e7d9cf] flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-[#ee7c2b] text-white rounded-lg hover:bg-[#ee7c2b]/90 disabled:opacity-50 transition-colors font-medium"
                  >
                    {loading ? "Criando..." : "Criar Usuário"}
                  </button>
                  <Link href="/admin/usuarios" className="flex-1">
                    <button
                      type="button"
                      className="w-full px-4 py-2 bg-[#f3ece7] text-[#1b130d] rounded-lg hover:bg-[#e7d9cf] transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                  </Link>
                </div>
              </form>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Campos obrigatórios:</strong> Nome completo, Email e
                Senha. O papel padrão é Cliente, mas pode ser alterado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
