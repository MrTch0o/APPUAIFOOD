"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ownerService } from "@/services/ownerService";
import { productAdminService } from "@/services/productAdminService";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

interface Restaurant {
  id: string;
  name: string;
  restaurantCategoryId?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  restaurantId: string;
  isActive: boolean;
  createdAt: string;
}

export default function OwnerProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    searchParams.get("restaurantId") || ""
  );

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
  }, [authLoading, user, router]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedRestaurantId) {
      loadProducts();
    } else {
      setProducts([]);
    }
  }, [selectedRestaurantId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ownerService.getMyRestaurants();
      setRestaurants(data);

      // Se há restaurantId na query, usar esse
      if (searchParams.get("restaurantId")) {
        setSelectedRestaurantId(searchParams.get("restaurantId")!);
      } else if (data.length > 0) {
        setSelectedRestaurantId(data[0].id);
      }
    } catch (err) {
      console.error("Erro ao carregar restaurantes:", err);
      setError("Erro ao carregar restaurantes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!selectedRestaurantId) return;

    try {
      setError(null);
      const data = await productAdminService.getProductsByRestaurant(
        selectedRestaurantId
      );
      setProducts(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Erro ao carregar produtos. Tente novamente.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }

    try {
      await productAdminService.deleteProduct(productId);
      loadProducts();
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      setError("Erro ao deletar produto. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader title="Produtos" backHref="/owner" />
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
        <PageHeader
          title="Produtos"
          backHref="/owner"
          action={
            selectedRestaurantId && (
              <Link
                href={`/admin/produtos/criar?restaurantId=${selectedRestaurantId}`}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                + Novo Produto
              </Link>
            )
          }
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Seletor de Restaurante */}
        {restaurants.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <label
              htmlFor="restaurant-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Selecionar Restaurante
            </label>
            <select
              id="restaurant-select"
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Escolha um restaurante</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Produtos */}
        {selectedRestaurantId ? (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 mb-4">
                  Nenhum produto cadastrado neste restaurante.
                </p>
                <Link
                  href={`/admin/produtos/criar?restaurantId=${selectedRestaurantId}`}
                  className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Criar Primeiro Produto
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Criado em
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-sm text-gray-600 truncate">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            R$ {product.price.toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.isActive ? "Ativo" : "Inativo"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(product.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link
                            href={`/admin/produtos/${product.id}`}
                            className="inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="inline-block px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            Deletar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">
              Selecione um restaurante para visualizar seus produtos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
