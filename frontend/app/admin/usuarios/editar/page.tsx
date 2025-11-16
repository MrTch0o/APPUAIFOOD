"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  userService,
  AdminUserResponse,
  UpdateUserRequest,
} from "@/services/userService";
import { logger } from "@/lib/logger";

export default function EditUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();
  const userId = searchParams.get("id");

  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: "",
    email: "",
    phone: "",
  });

  const [roleSelection, setRoleSelection] = useState<
    "CLIENT" | "RESTAURANT_OWNER" | "ADMIN"
  >("CLIENT");

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUserById(userId!);
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });
      setRoleSelection(userData.role);
      setError("");
    } catch (err) {
      logger.error("Erro ao carregar usuário", err);
      setError("Erro ao carregar usuário");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "ADMIN" && userId) {
      loadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);
      await userService.updateUser(userId, formData);
      setSuccess("Usuário atualizado com sucesso!");
      setTimeout(() => router.back(), 2000);
    } catch (err) {
      logger.error("Erro ao salvar usuário", err);
      setError("Erro ao salvar usuário");
    } finally {
      setSaving(false);
    }
  };

  const handleChangeRole = async () => {
    if (!userId || !user || roleSelection === user.role) {
      setError("Selecione um papel diferente");
      return;
    }

    try {
      setSaving(true);
      const result = await userService.updateUserRole(userId, roleSelection);
      setUser(result.user);
      setSuccess("Papel alterado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      logger.error("Erro ao alterar papel", err);
      setError("Erro ao alterar papel");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!userId) return;

    try {
      setSaving(true);
      await userService.deactivateUser(userId);
      setSuccess("Usuário desativado com sucesso!");
      setTimeout(() => router.back(), 2000);
    } catch (err) {
      logger.error("Erro ao desativar usuário", err);
      setError("Erro ao desativar usuário");
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
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

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="flex w-full max-w-2xl flex-col px-4">
              <div className="text-center py-8">
                <p className="text-[#9a6c4c]">Carregando...</p>
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
                Editar Usuário
              </h1>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-[#f3ece7] text-[#1b130d] rounded-lg hover:bg-[#e7d9cf] transition-colors font-medium"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Voltar
              </button>
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

            {user && (
              <div className="space-y-6">
                {/* User Info Card */}
                <div className="bg-white rounded-lg border border-[#e7d9cf] p-6">
                  <h2 className="text-[#1b130d] text-lg font-bold mb-4">
                    Informações do Usuário
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#1b130d] font-medium mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b]"
                        placeholder="Nome do usuário"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1b130d] font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b]"
                        placeholder="Email do usuário"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1b130d] font-medium mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b]"
                        placeholder="Telefone (opcional)"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#e7d9cf]">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full px-4 py-2 bg-[#ee7c2b] text-white rounded-lg hover:bg-[#ee7c2b]/90 disabled:opacity-50 transition-colors font-medium"
                      >
                        {saving ? "Salvando..." : "Salvar Informações"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Management */}
                <div className="bg-white rounded-lg border border-[#e7d9cf] p-6">
                  <h2 className="text-[#1b130d] text-lg font-bold mb-4">
                    Gerenciar Papel
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#1b130d] font-medium mb-2">
                        Papel Atual
                      </label>
                      <div className="px-4 py-3 bg-[#f8f7f6] rounded-lg border border-[#e7d9cf] text-[#1b130d] font-medium">
                        {user.role === "ADMIN"
                          ? "Administrador"
                          : user.role === "RESTAURANT_OWNER"
                          ? "Proprietário de Restaurante"
                          : "Cliente"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#1b130d] font-medium mb-2">
                        Alterar para
                      </label>
                      <select
                        value={roleSelection}
                        onChange={(e) =>
                          setRoleSelection(
                            e.target.value as
                              | "CLIENT"
                              | "RESTAURANT_OWNER"
                              | "ADMIN"
                          )
                        }
                        className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee7c2b]"
                      >
                        <option value="CLIENT">Cliente</option>
                        <option value="RESTAURANT_OWNER">
                          Proprietário de Restaurante
                        </option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-[#e7d9cf]">
                      <button
                        onClick={handleChangeRole}
                        disabled={saving || roleSelection === user.role}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {saving ? "Alterando..." : "Alterar Papel"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Deactivate Account */}
                <div className="bg-white rounded-lg border border-red-200 p-6">
                  <h2 className="text-red-600 text-lg font-bold mb-4">
                    Zona de Perigo
                  </h2>
                  <p className="text-[#9a6c4c] mb-4">
                    Desativar a conta do usuário. O usuário não poderá mais
                    acessar o sistema, mas os dados serão preservados.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      Desativar Usuário
                    </button>
                  ) : (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-700 font-medium mb-4">
                        Tem certeza? Esta ação desativará a conta do usuário.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDeactivate}
                          disabled={saving}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                        >
                          {saving ? "Desativando..." : "Confirmar Desativação"}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 px-4 py-2 bg-[#f3ece7] text-[#1b130d] rounded-lg hover:bg-[#e7d9cf] transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
