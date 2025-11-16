"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  restaurantAdminService,
  CreateRestaurantRequest,
} from "@/services/restaurantAdminService";
import {
  restaurantCategoryService,
  RestaurantCategory,
} from "@/services/categoryService";
import { logger } from "@/lib/logger";
import { OpeningHoursInput } from "@/components/OpeningHoursInput";

export default function NovoRestaurantePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<RestaurantCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState<CreateRestaurantRequest>({
    name: "",
    description: "",
    address: "",
    phone: "",
    restaurantCategoryId: "",
    deliveryFee: 0,
    deliveryTime: "",
    minimumOrder: 0,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await restaurantCategoryService.getAll(true);
        setCategories(data);
      } catch (err) {
        logger.error("Erro ao carregar categorias", err);
        setError("Erro ao carregar categorias. Tente recarregar a página.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="flex w-full max-w-6xl flex-col px-4">
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 mb-6">
                <Link
                  href="/"
                  className="flex items-center gap-4 text-[#1b130d]"
                >
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
                  <h2 className="text-[#1b130d] text-lg font-bold leading-tight tracking-[-0.015em]">
                    UAIFOOD
                  </h2>
                </Link>
              </header>
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <p className="text-[#9a6c4c] mb-4">
                    Acesso negado. Apenas administradores podem criar
                    restaurantes.
                  </p>
                  <Link href="/">
                    <button className="px-6 py-2 bg-[#ee7c2b] text-white rounded-lg hover:bg-[#ee7c2b]/90">
                      Voltar para Home
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      logger.info("Iniciando cadastro de restaurante", { name: formData.name });

      // Validações básicas
      if (!formData.name.trim()) {
        throw new Error("Nome do restaurante é obrigatório");
      }
      if (!formData.description.trim()) {
        throw new Error("Descrição é obrigatória");
      }
      if (!formData.address.trim()) {
        throw new Error("Endereço é obrigatório");
      }
      if (!formData.phone.trim()) {
        throw new Error("Telefone é obrigatório");
      }
      if (!formData.restaurantCategoryId.trim()) {
        throw new Error("Categoria é obrigatória");
      }
      if (formData.deliveryFee <= 0) {
        throw new Error("Taxa de entrega deve ser maior que 0");
      }
      if (!formData.deliveryTime.trim()) {
        throw new Error("Tempo de entrega é obrigatório");
      }

      console.log("Sending create data:", formData);

      // Criar restaurante
      const restaurant = await restaurantAdminService.create(formData);
      logger.info("Restaurante criado com sucesso", {
        restaurantId: restaurant.id,
      });

      // Upload de imagem se fornecida
      if (selectedFile) {
        logger.info("Fazendo upload de imagem", {
          restaurantId: restaurant.id,
        });
        await restaurantAdminService.uploadImage(restaurant.id, selectedFile);
        logger.info("Imagem enviada com sucesso");
      }

      setSuccess("Restaurante criado com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/admin/restaurantes");
      }, 1500);
    } catch (err) {
      let errorMessage = "Erro ao criar restaurante";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
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
              e.constraints
                ? Object.values(e.constraints).join(", ")
                : e.message
            )
            .join("; ");
        }
      }

      logger.error("Erro ao criar restaurante", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="flex w-full max-w-2xl flex-col px-4">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 mb-6">
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
                <h2 className="text-[#1b130d] text-lg font-bold leading-tight tracking-[-0.015em]">
                  UAIFOOD
                </h2>
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
                Novo Restaurante
              </h1>
              <p className="text-[#9a6c4c]">
                Preencha os dados abaixo para cadastrar um novo restaurante
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
              className="bg-white rounded-xl shadow-md p-6 mb-8"
            >
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Foto do Restaurante
                </label>
                <div className="flex flex-col gap-4">
                  {imagePreview && (
                    <div className="relative h-40 w-full overflow-hidden rounded-lg">
                      <Image
                        alt="Preview"
                        className="h-full w-full object-cover"
                        src={imagePreview}
                        fill
                        sizes="(max-width: 768px) 100vw, 100vw"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-[#1b130d] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-[#ee7c2b] hover:file:bg-[#ee7c2b]/90 cursor-pointer"
                  />
                  <p className="text-sm text-[#9a6c4c]">
                    Formatos: JPG, PNG. Tamanho máximo: 5MB
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Nome do Restaurante *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  placeholder="Ex: Pizzaria do João"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Descrição *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  placeholder="Descreva seu restaurante..."
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Endereço *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  placeholder="Rua, número - Bairro, Cidade"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  placeholder="(31) 99999-9999"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Categoria *
                </label>
                {loadingCategories ? (
                  <div className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d]">
                    Carregando categorias...
                  </div>
                ) : (
                  <select
                    name="restaurantCategoryId"
                    value={formData.restaurantCategoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Delivery Fee */}
              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Taxa de Entrega (R$) *
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  placeholder="5.00"
                />
              </div>

              {/* Delivery Time */}
              <div className="mb-4">
                <label className="block text-[#1b130d] font-bold mb-2">
                  Tempo de Entrega *
                </label>
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                  placeholder="30-45 min"
                />
              </div>

              {/* Minimum Order */}
              <div className="mb-8">
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
                  placeholder="0.00"
                />
              </div>

              {/* Opening Hours Section */}
              <div className="bg-[#f8f7f6] rounded-lg border border-[#e7d9cf] p-6 mb-8">
                <h3 className="text-lg font-bold text-[#1b130d] mb-4">
                  Horário de Funcionamento (Opcional)
                </h3>
                <OpeningHoursInput
                  value={formData.openingHours}
                  onChange={(hours) =>
                    setFormData((prev) => ({ ...prev, openingHours: hours }))
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#ee7c2b] text-white font-bold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Cadastrando..." : "Cadastrar Restaurante"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 bg-[#f3ece7] text-[#1b130d] font-bold rounded-lg hover:bg-[#e7d9cf] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
