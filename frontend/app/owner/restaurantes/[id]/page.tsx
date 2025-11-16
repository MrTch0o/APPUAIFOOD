"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ownerService } from "@/services/ownerService";
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  openingHours?: string | Record<string, string | string[]> | null;
  deliveryFee?: number;
  deliveryTime?: number;
  minimumOrder?: number;
  restaurantCategoryId?: string;
  image?: string;
  isActive: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string | null;
}

export default function RestaurantDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!authLoading && user?.role !== "RESTAURANT_OWNER") {
      router.push("/");
      return;
    }

    if (!authLoading && user) {
      loadRestaurant();
    }
  }, [authLoading, user, restaurantId, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ownerService.getMyRestaurantById(restaurantId);
      setRestaurant(data);
    } catch (err) {
      console.error("Erro ao carregar restaurante:", err);
      setError("Erro ao carregar restaurante. Tente novamente.");
    } finally {
      setLoading(false);
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
              Detalhes do Restaurante
            </h1>
          </div>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
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
              Detalhes do Restaurante
            </h1>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error || "Restaurante não encontrado"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Detalhes do Restaurante
            </h1>
          </div>
          <Link
            href={`/owner/restaurantes/editar?id=${restaurant.id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Editar
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Nome e Status */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {restaurant.name}
              </h2>
              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  restaurant.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {restaurant.isActive ? "Ativo" : "Inativo"}
              </div>
            </div>
            {restaurant.rating && (
              <p className="text-sm text-gray-600">
                Avaliação:{" "}
                <span className="font-semibold">{restaurant.rating}★</span>
              </p>
            )}
          </div>

          {/* Descrição */}
          {restaurant.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Descrição
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {restaurant.description}
              </p>
            </div>
          )}

          {/* Informações de Contato */}
          <div className="grid grid-cols-2 gap-6">
            {restaurant.address && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Endereço
                </h4>
                <p className="text-gray-600">{restaurant.address}</p>
              </div>
            )}
            {restaurant.phone && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Telefone
                </h4>
                <p className="text-gray-600">{restaurant.phone}</p>
              </div>
            )}
          </div>

          {/* Horário */}
          {restaurant.openingHours && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Horário de Funcionamento
              </h4>
              <p className="text-gray-600">
                {typeof restaurant.openingHours === "string"
                  ? restaurant.openingHours
                  : "Horário disponível"}
              </p>
            </div>
          )}

          {/* Informações de Entrega */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Informações de Entrega
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Taxa de Entrega</p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {(restaurant.deliveryFee || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Tempo de Entrega</p>
                <p className="text-lg font-semibold text-gray-900">
                  {restaurant.deliveryTime || 0} min
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Pedido Mínimo</p>
                <p className="text-lg font-semibold text-gray-900">
                  R$ {(restaurant.minimumOrder || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 space-y-1">
            <p>
              Criado em:{" "}
              {new Date(restaurant.createdAt).toLocaleDateString("pt-BR")}
            </p>
            {restaurant.updatedAt && (
              <p>
                Último update:{" "}
                {new Date(restaurant.updatedAt).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-4 pt-4">
            <Link
              href={`/owner/produtos?restaurantId=${restaurant.id}`}
              className="flex-1 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-center"
            >
              Ver Produtos
            </Link>
            <Link
              href={`/owner/pedidos?restaurantId=${restaurant.id}`}
              className="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-center"
            >
              Ver Pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
