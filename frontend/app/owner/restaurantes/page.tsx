"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ownerService } from "@/services/ownerService";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  restaurantCategoryId?: string;
  isActive: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string | null;
}

export default function OwnerRestaurantsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      loadRestaurants();
    }
  }, [authLoading, user, router]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ownerService.getMyRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error("Erro ao carregar restaurantes:", err);
      setError("Erro ao carregar restaurantes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Meus Restaurantes
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
      <div className="max-w-7xl mx-auto">
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
              Meus Restaurantes
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Você não tem restaurantes cadastrados.
            </p>
            <Link
              href="/admin/restaurantes"
              className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Criar Restaurante
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {restaurant.name}
                  </h3>
                  {restaurant.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {restaurant.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {restaurant.address && (
                    <p>
                      <span className="font-semibold">Endereço:</span>{" "}
                      {restaurant.address}
                    </p>
                  )}
                  {restaurant.phone && (
                    <p>
                      <span className="font-semibold">Telefone:</span>{" "}
                      {restaurant.phone}
                    </p>
                  )}
                  {restaurant.rating && (
                    <p>
                      <span className="font-semibold">Avaliação:</span>{" "}
                      {restaurant.rating}★
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      restaurant.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {restaurant.isActive ? "Ativo" : "Inativo"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/owner/restaurantes/${restaurant.id}`}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center text-sm font-medium"
                  >
                    Ver Detalhes
                  </Link>
                  <Link
                    href={`/owner/restaurantes/editar?id=${restaurant.id}`}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center text-sm font-medium"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
