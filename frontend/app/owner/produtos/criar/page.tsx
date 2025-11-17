"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  productAdminService,
  CreateProductRequest,
} from "@/services/productAdminService";
import {
  productCategoryService,
  ProductCategory,
} from "@/services/categoryService";
import { logger } from "@/lib/logger";
import { PageHeader } from "@/components/PageHeader";

export default function CreateOwnerProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const restaurantId = searchParams.get("restaurantId") || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
    restaurantId: restaurantId || "",
    productCategoryId: "",
    preparationTime: 30,
    available: true,
    isActive: true,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await productCategoryService.getAll();
        setCategories(data);
        setError("");
      } catch (err) {
        logger.error("Erro ao carregar categorias", err);
        setError("Erro ao carregar categorias");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "RESTAURANT_OWNER" && restaurantId) {
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, restaurantId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseFloat(value) || 0
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!restaurantId) {
      setError("ID do restaurante não encontrado");
      return;
    }

    try {
      setSaving(true);
      const response = await productAdminService.create({
        ...formData,
        restaurantId,
      });

      if (selectedFile) {
        logger.info("Fazendo upload de imagem", { productId: response.id });
        await productAdminService.uploadImage(response.id, selectedFile);
      }

      setSuccess("Produto criado com sucesso!");
      setTimeout(() => {
        router.push(`/owner/produtos?restaurantId=${restaurantId}`);
      }, 2000);
    } catch (err) {
      logger.error("Erro ao salvar produto", err);
      let errorMessage = "Erro ao salvar produto";
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
      }
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== "RESTAURANT_OWNER") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <PageHeader title="Novo Produto" backHref="/owner" />
          <div className="flex justify-center items-center min-h-[400px] bg-white rounded-lg">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Acesso negado.</p>
              <Link href="/owner">
                <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  Voltar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <PageHeader title="Novo Produto" backHref="/owner" />
          <div className="flex justify-center items-center min-h-[400px] bg-white rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="Novo Produto"
          backHref={`/owner/produtos?restaurantId=${restaurantId}`}
        />

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

        {/* Create Form */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Criar Novo Produto
          </h3>

          <div className="mb-4">
            <label className="block text-gray-900 font-bold mb-2">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-600 focus:outline-0 focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 font-bold mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-600 focus:outline-0 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-900 font-bold mb-2">
                Preço (R$)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-600 focus:outline-0 focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-900 font-bold mb-2">
                Tempo de Preparo (min)
              </label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-600 focus:outline-0 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-900 font-bold mb-2">
              Categoria
            </label>
            <select
              name="productCategoryId"
              value={formData.productCategoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-0 focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-900 font-bold mb-2">
              Foto do Produto
            </label>
            {imagePreview && (
              <div className="relative h-40 w-full overflow-hidden rounded-lg mb-4">
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-0 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Criando..." : "Criar Produto"}
            </button>
            <Link
              href={`/owner/produtos?restaurantId=${restaurantId}`}
              className="flex-1"
            >
              <button
                type="button"
                className="w-full px-6 py-3 bg-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
