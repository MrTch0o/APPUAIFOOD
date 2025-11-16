"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import { ownerService } from "@/services/ownerService";
import { restaurantService } from "@/services/restaurantService";

interface RestaurantForm {
  name: string;
  description: string;
  address: string;
  phone: string;
  openingHours: string;
  deliveryFee: number;
  deliveryTime: number;
  minimumOrder: number;
  restaurantCategoryId: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

export default function EditRestaurantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authContext = useContext(AuthContext);
  const restaurantId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<RestaurantForm>({
    name: "",
    description: "",
    address: "",
    phone: "",
    openingHours: "",
    deliveryFee: 0,
    deliveryTime: 30,
    minimumOrder: 0,
    restaurantCategoryId: "",
    isActive: true,
  });

  useEffect(() => {
    if (!authContext?.user) {
      router.push("/login");
      return;
    }

    if (authContext.user.role !== "RESTAURANT_OWNER") {
      router.push("/");
      return;
    }

    if (!restaurantId) {
      router.push("/owner/restaurantes");
      return;
    }

    loadData();
  }, [authContext, restaurantId, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar categorias
      const categoriesData = await restaurantService.getCategories();
      setCategories(categoriesData);

      // Carregar dados do restaurante
      const restaurant = await ownerService.getMyRestaurantById(restaurantId!);
      setFormData({
        name: restaurant.name,
        description: restaurant.description || "",
        address: restaurant.address || "",
        phone: restaurant.phone || "",
        openingHours: restaurant.openingHours || "",
        deliveryFee: restaurant.deliveryFee || 0,
        deliveryTime: restaurant.deliveryTime || 30,
        minimumOrder: restaurant.minimumOrder || 0,
        restaurantCategoryId: restaurant.restaurantCategoryId || "",
        isActive: restaurant.isActive,
      });
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Nome do restaurante é obrigatório");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await restaurantService.updateRestaurant(restaurantId!, formData);
      router.push("/owner/restaurantes");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setError("Erro ao salvar restaurante. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Editar Restaurante
            </h1>
          </div>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Restaurante
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome do Restaurante *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Categoria */}
          <div>
            <label
              htmlFor="restaurantCategoryId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoria
            </label>
            <select
              id="restaurantCategoryId"
              name="restaurantCategoryId"
              value={formData.restaurantCategoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Endereço */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Endereço
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Horário de Funcionamento */}
          <div>
            <label
              htmlFor="openingHours"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Horário de Funcionamento
            </label>
            <input
              type="text"
              id="openingHours"
              name="openingHours"
              placeholder="Ex: 10:00 - 22:00"
              value={formData.openingHours}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Delivery Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="deliveryFee"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Taxa de Entrega (R$)
              </label>
              <input
                type="number"
                id="deliveryFee"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="deliveryTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tempo de Entrega (min)
              </label>
              <input
                type="number"
                id="deliveryTime"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Pedido Mínimo */}
          <div>
            <label
              htmlFor="minimumOrder"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pedido Mínimo (R$)
            </label>
            <input
              type="number"
              id="minimumOrder"
              name="minimumOrder"
              value={formData.minimumOrder}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Restaurante Ativo
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
