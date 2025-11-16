"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  productAdminService,
  AdminProductResponse,
} from "@/services/productAdminService";
import {
  restaurantAdminService,
  AdminRestaurantResponse,
} from "@/services/restaurantAdminService";
import { logger } from "@/lib/logger";

export default function ProductsAdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<AdminProductResponse[]>([]);
  const [restaurants, setRestaurants] = useState<AdminRestaurantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, restaurantsData] = await Promise.all([
        selectedRestaurant
          ? productAdminService.getProductsByRestaurant(selectedRestaurant)
          : productAdminService.getAllProducts(),
        restaurantAdminService.getAllRestaurants(),
      ]);
      setProducts(productsData);
      setRestaurants(restaurantsData);
      setError("");
    } catch (err) {
      logger.error("Erro ao carregar dados", err);
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedRestaurant]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await productAdminService.deleteProduct(id);
      setSuccess("Produto deletado com sucesso!");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      logger.error("Erro ao deletar produto", err);
      setError("Erro ao deletar produto");
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="flex w-full max-w-6xl flex-col px-4">
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <p className="text-[#9a6c4c] mb-4">
                    Acesso negado. Apenas administradores podem gerenciar
                    produtos.
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
          <div className="flex w-full max-w-6xl flex-col px-4">
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

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-[#1b130d] text-3xl font-bold">
                Gerenciar Produtos
              </h1>
              <p className="text-[#9a6c4c] mt-1">
                Criar e gerenciar produtos dos restaurantes
              </p>
            </div>

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

            {/* Filter Section */}
            <div className="mb-6 flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[#1b130d] font-medium mb-2">
                  Filtrar por Restaurante
                </label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg bg-white text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                >
                  <option value="">Todos os restaurantes</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <Link href="/admin/produtos/novo">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#ee7c2b] text-white rounded-lg hover:bg-[#ee7c2b]/90 transition-colors font-medium">
                  <span className="material-symbols-outlined">add</span>
                  Novo Produto
                </button>
              </Link>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-[#e7d9cf]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e7d9cf] bg-[#f8f7f6]">
                      <th className="px-6 py-4 text-left text-[#1b130d] font-bold">
                        Nome
                      </th>
                      <th className="px-6 py-4 text-left text-[#1b130d] font-bold">
                        Restaurante
                      </th>
                      <th className="px-6 py-4 text-left text-[#1b130d] font-bold">
                        Preço
                      </th>
                      <th className="px-6 py-4 text-left text-[#1b130d] font-bold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[#1b130d] font-bold">
                        Criado em
                      </th>
                      <th className="px-6 py-4 text-center text-[#1b130d] font-bold">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-[#9a6c4c]"
                        >
                          Carregando...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-[#9a6c4c]"
                        >
                          Nenhum produto encontrado
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-[#e7d9cf] hover:bg-[#f8f7f6]"
                        >
                          <td className="px-6 py-4 text-[#1b130d] font-medium">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 text-[#9a6c4c]">
                            {product.restaurant?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-[#1b130d] font-medium">
                            R$ {product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                product.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.isActive ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#9a6c4c] text-sm">
                            {new Date(product.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/admin/produtos/editar?id=${product.id}`}
                              >
                                <button className="text-[#ee7c2b] hover:text-[#ee7c2b]/80 font-medium text-sm">
                                  Editar
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                              >
                                Deletar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
