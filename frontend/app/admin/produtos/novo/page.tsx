"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  productAdminService,
  CreateProductRequest,
} from "@/services/productAdminService";
import {
  productCategoryService,
  ProductCategory,
} from "@/services/categoryService";
import {
  restaurantAdminService,
  AdminRestaurantResponse,
} from "@/services/restaurantAdminService";
import { logger } from "@/lib/logger";

export default function NovoProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [restaurants, setRestaurants] = useState<AdminRestaurantResponse[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
    restaurantId: "",
    productCategoryId: "",
    preparationTime: 30,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [restaurantsData, categoriesData] = await Promise.all([
          restaurantAdminService.getAllRestaurants(),
          productCategoryService.getAll(),
        ]);
        setRestaurants(restaurantsData);
        setCategories(categoriesData);
      } catch (err) {
        logger.error("Erro ao carregar dados", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoadingData(false);
      }
    };

    if (user && user.role === "ADMIN") {
      loadData();
    }
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error("Nome do produto é obrigatório");
      }
      if (!formData.restaurantId) {
        throw new Error("Selecione um restaurante");
      }
      if (!formData.productCategoryId) {
        throw new Error("Selecione uma categoria");
      }
      if (formData.price <= 0) {
        throw new Error("O preço deve ser maior que 0");
      }

      logger.info("Criando novo produto", { name: formData.name });

      await productAdminService.create(formData);

      setSuccess("Produto criado com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/admin/produtos");
      }, 1500);
    } catch (err) {
      let errorMessage = "Erro ao criar produto";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const axiosError = err as {
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

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        } else if (
          axiosError.response?.data?.errors &&
          Array.isArray(axiosError.response.data.errors)
        ) {
          errorMessage = axiosError.response.data.errors
            .map((e) =>
              e.constraints
                ? Object.values(e.constraints).join(", ")
                : e.message
            )
            .join("; ");
        }
      }

      logger.error("Erro ao criar produto", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="flex w-full max-w-2xl flex-col px-4">
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <p className="text-[#9a6c4c] mb-4">
                    Acesso negado. Apenas administradores podem criar produtos.
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

  if (loadingData) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="flex w-full max-w-2xl flex-col px-4">
              <div className="flex justify-center items-center p-8">
                <p className="text-[#9a6c4c]">Carregando dados...</p>
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

            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-[#1b130d] mb-2">
                Novo Produto
              </h1>
              <p className="text-[#9a6c4c]">
                Preencha os dados abaixo para criar um novo produto
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg border border-[#e7d9cf] p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-[#1b130d] mb-4">
                Informações do Produto
              </h3>

              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Margherita"
                  required
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
                  placeholder="Descrição do produto"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[#1b130d] font-bold mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  />
                </div>
                <div>
                  <label className="block text-[#1b130d] font-bold mb-2">
                    Tempo de Preparo (min)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Restaurante *
                </label>
                <select
                  name="restaurantId"
                  value={formData.restaurantId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-white text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                >
                  <option value="">Selecione um restaurante</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Categoria *
                </label>
                <select
                  name="productCategoryId"
                  value={formData.productCategoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-white text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-[#ee7c2b] text-white font-bold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Criando..." : "Criar Produto"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
