"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  restaurantAdminService,
  AdminRestaurantResponse,
  UpdateRestaurantRequest,
} from "@/services/restaurantAdminService";
import {
  restaurantCategoryService,
  RestaurantCategory,
} from "@/services/categoryService";
import { logger } from "@/lib/logger";
import { OpeningHoursInput } from "@/components/OpeningHoursInput";

export default function EditRestaurantePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();
  const restaurantId = searchParams.get("id");

  const [restaurant, setRestaurant] = useState<AdminRestaurantResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState<RestaurantCategory[]>([]);

  const [formData, setFormData] = useState<UpdateRestaurantRequest>({
    name: "",
    description: "",
    address: "",
    phone: "",
    deliveryFee: 0,
    deliveryTime: "",
    minimumOrder: 0,
    restaurantCategoryId: "",
    openingHours: undefined,
  });

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const [restaurantData, categoriesData] = await Promise.all([
        restaurantAdminService.getRestaurantById(restaurantId!),
        restaurantCategoryService.getAll(),
      ]);
      setRestaurant(restaurantData);
      setCategories(categoriesData);
      setFormData({
        name: restaurantData.name,
        description: restaurantData.description,
        address: restaurantData.address,
        phone: restaurantData.phone,
        deliveryFee: restaurantData.deliveryFee,
        deliveryTime: restaurantData.deliveryTime?.toString(),
        minimumOrder: restaurantData.minimumOrder,
        restaurantCategoryId: restaurantData.restaurantCategoryId || "",
        openingHours: restaurantData.openingHours || undefined,
      });
      setError("");
    } catch (err) {
      logger.error("Erro ao carregar restaurante", err);
      setError("Erro ao carregar restaurante");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "ADMIN" && restaurantId) {
      loadRestaurant();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, restaurantId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      setSaving(true);
      // Filtrar apenas os campos que foram modificados
      const updateData: UpdateRestaurantRequest = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.description) updateData.description = formData.description;
      if (formData.address) updateData.address = formData.address;
      if (formData.phone) updateData.phone = formData.phone;
      if (formData.restaurantCategoryId) {
        updateData.restaurantCategoryId = formData.restaurantCategoryId;
      }
      if (formData.deliveryFee !== undefined && formData.deliveryFee !== null) {
        updateData.deliveryFee = formData.deliveryFee;
      }
      if (formData.deliveryTime) {
        updateData.deliveryTime = formData.deliveryTime;
      }
      if (
        formData.minimumOrder !== undefined &&
        formData.minimumOrder !== null
      ) {
        updateData.minimumOrder = formData.minimumOrder;
      }
      // Incluir openingHours sempre que estiver definido (mesmo que vazio)
      if (formData.openingHours !== undefined) {
        updateData.openingHours = formData.openingHours;
      }

      console.log("Sending update data:", updateData);
      await restaurantAdminService.updateRestaurant(restaurantId, updateData);
      setSuccess("Restaurante atualizado com sucesso!");
      setTimeout(() => router.back(), 2000);
    } catch (err) {
      logger.error("Erro ao salvar restaurante", err);

      // Extrair mensagem de erro do backend
      let errorMessage = "Erro ao salvar restaurante";

      const error = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
            errors?: Array<{
              constraints?: Record<string, string>;
              message?: string;
            }>;
          };
        };
      };

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        // Para validação do class-validator
        errorMessage = error.response.data.errors
          .map((e) =>
            e.constraints ? Object.values(e.constraints).join(", ") : e.message
          )
          .join("; ");
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!restaurantId) return;

    try {
      setSaving(true);
      await restaurantAdminService.deactivateRestaurant(restaurantId);
      setSuccess("Restaurante desativado com sucesso!");
      setTimeout(() => router.push("/admin/restaurantes"), 2000);
    } catch (err) {
      logger.error("Erro ao desativar restaurante", err);
      setError("Erro ao desativar restaurante");
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleActivate = async () => {
    if (!restaurantId) return;

    try {
      setSaving(true);
      const result = await restaurantAdminService.activateRestaurant(
        restaurantId
      );
      setRestaurant(result.restaurant);
      setSuccess("Restaurante ativado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      logger.error("Erro ao ativar restaurante", err);
      setError("Erro ao ativar restaurante");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return "-";
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
              <header className="flex items-center justify-between border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 mb-6">
                <Link
                  href="/"
                  className="flex items-center gap-4 text-[#1b130d]"
                >
                  <h2 className="text-[#1b130d] text-lg font-bold">UAIFOOD</h2>
                </Link>
              </header>
              <div className="flex justify-center items-center p-8">
                <p className="text-[#9a6c4c]">Carregando restaurante...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
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
                  <p className="text-[#9a6c4c] mb-4">
                    Restaurante não encontrado
                  </p>
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
            <header className="flex items-center justify-between border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 mb-6">
              <Link href="/" className="flex items-center gap-4 text-[#1b130d]">
                <div className="size-6 text-[#ee7c2b]">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-[#1b130d] text-lg font-bold">UAIFOOD</h2>
              </Link>
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
              <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* System Info Card */}
            <div className="bg-white rounded-lg border border-[#e7d9cf] p-6 mb-6">
              <h3 className="text-lg font-bold text-[#1b130d] mb-4">
                Informações do Sistema
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#9a6c4c]">ID</p>
                  <p className="text-[#1b130d] font-mono text-sm break-all">
                    {restaurant.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#9a6c4c]">Proprietário</p>
                  <p className="text-[#1b130d] text-sm">
                    {restaurant.owner?.name || "-"}
                  </p>
                  {restaurant.owner?.email && (
                    <p className="text-[#9a6c4c] text-xs">
                      {restaurant.owner.email}
                    </p>
                  )}
                  {restaurant.owner?.phone && (
                    <p className="text-[#9a6c4c] text-xs">
                      {restaurant.owner.phone}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#9a6c4c]">Categoria</p>
                  <p className="text-[#1b130d] text-sm">
                    {categories.find(
                      (cat) => cat.id === restaurant.restaurantCategoryId
                    )?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#9a6c4c]">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      restaurant.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {restaurant.isActive ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#9a6c4c]">Criado em</p>
                    <p className="text-[#1b130d] text-xs">
                      {formatDate(restaurant.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#9a6c4c]">Atualizado em</p>
                    <p className="text-[#1b130d] text-xs">
                      {formatDate(restaurant.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <form
              onSubmit={handleSave}
              className="bg-white rounded-lg border border-[#e7d9cf] p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-[#1b130d] mb-4">
                Informações do Restaurante
              </h3>

              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Categoria do Restaurante
                </label>
                <select
                  name="restaurantCategoryId"
                  value={formData.restaurantCategoryId || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-[#1b130d] font-bold mb-2">
                    Taxa de Entrega (R$)
                  </label>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={formData.deliveryFee}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#1b130d] font-bold mb-2">
                    Tempo de Entrega
                  </label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#1b130d] font-bold mb-2">
                    Pedido Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    name="minimumOrder"
                    value={formData.minimumOrder}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  />
                </div>
              </div>

              {/* Opening Hours */}
              <div className="mb-6 bg-[#f8f7f6] rounded-lg border border-[#e7d9cf] p-6">
                <OpeningHoursInput
                  value={formData.openingHours}
                  onChange={(hours) =>
                    setFormData((prev) => ({ ...prev, openingHours: hours }))
                  }
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-[#ee7c2b] text-white font-bold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>

            {/* Status Management */}
            <div className="bg-white rounded-lg border border-[#e7d9cf] p-6 mt-6">
              <h3 className="text-lg font-bold text-[#1b130d] mb-4">
                Gerenciar Status
              </h3>
              {restaurant.isActive ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Desativar Restaurante
                </button>
              ) : (
                <button
                  onClick={handleActivate}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Ativando..." : "Ativar Restaurante"}
                </button>
              )}
            </div>

            {/* Deactivate Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                  <h3 className="text-lg font-bold text-[#1b130d] mb-2">
                    Desativar Restaurante?
                  </h3>
                  <p className="text-[#9a6c4c] mb-6">
                    Tem certeza que deseja desativar este restaurante?
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-[#f3ece7] text-[#1b130d] font-bold rounded-lg hover:bg-[#e7d9cf] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeactivate}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Desativando..." : "Desativar"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
