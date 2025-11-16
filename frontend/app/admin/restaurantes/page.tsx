"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  restaurantAdminService,
  AdminRestaurantResponse,
} from "@/services/restaurantAdminService";
import { logger } from "@/lib/logger";

export default function RestaurantsManagementPage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [restaurants, setRestaurants] = useState<AdminRestaurantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authUser && authUser.role === "ADMIN") {
      loadRestaurants();
    }
  }, [authUser]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantAdminService.getAllRestaurants();
      console.log("Restaurants loaded:", data);
      if (!Array.isArray(data)) {
        throw new Error(`Expected array but got ${typeof data}`);
      }
      setRestaurants(data);
      setError("");
    } catch (err) {
      logger.error("Erro ao carregar restaurantes", err);
      setError(
        `Erro ao carregar restaurantes: ${
          err instanceof Error ? err.message : "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
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

  const formatOpeningHours = (
    hours?: Record<string, string> | null
  ): string => {
    if (!hours || typeof hours !== "object") return "-";
    const daysMap: { [key: string]: string } = {
      seg: "Seg",
      ter: "Ter",
      qua: "Qua",
      qui: "Qui",
      sex: "Sex",
      sab: "Sáb",
      dom: "Dom",
    };
    const formatted = Object.entries(hours)
      .map(([day, time]) => {
        if (!time) return null;
        return `${daysMap[day]}: ${time}`;
      })
      .filter(Boolean)
      .join(" | ");
    return formatted || "-";
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="flex w-full max-w-6xl flex-col px-4">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 mb-6 bg-white rounded-lg">
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
            </header>

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-[#1b130d] text-3xl font-bold">
                Gerenciar Restaurantes
              </h1>
              <p className="text-[#9a6c4c] mt-1">
                Visualizar e gerenciar restaurantes cadastrados
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-[#f3ece7] text-[#1b130d] rounded-lg hover:bg-[#e7d9cf] transition-colors font-medium"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Voltar
              </button>
              <button
                onClick={() => router.push("/admin/restaurantes/novo")}
                className="flex items-center gap-2 px-4 py-2 bg-[#ee7c2b] text-white rounded-lg hover:bg-[#ee7c2b]/90 transition-colors font-medium"
              >
                <span className="material-symbols-outlined">add</span>
                Adicionar Novo Restaurante
              </button>
            </div>

            {/* Restaurants List */}
            <div className="bg-white rounded-lg border border-[#e7d9cf]">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-[#e7d9cf] bg-[#f8f7f6]">
                      <th className="px-4 py-3 text-left text-[#1b130d] font-bold text-sm">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-left text-[#1b130d] font-bold text-sm">
                        Proprietário
                      </th>
                      <th className="px-4 py-3 text-left text-[#1b130d] font-bold text-sm">
                        Telefone
                      </th>
                      <th className="px-4 py-3 text-left text-[#1b130d] font-bold text-sm">
                        Taxa Entrega
                      </th>
                      <th className="px-4 py-3 text-left text-[#1b130d] font-bold text-sm">
                        Horário
                      </th>
                      <th className="px-4 py-3 text-left text-[#1b130d] font-bold text-sm">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-[#1b130d] font-bold text-xs">
                        Data de Cadastro
                      </th>
                      <th className="px-3 py-3 text-left text-[#1b130d] font-bold text-xs">
                        Atualizado em
                      </th>
                      <th className="px-4 py-3 text-center text-[#1b130d] font-bold text-sm">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-8 text-center text-[#9a6c4c]"
                        >
                          Carregando restaurantes...
                        </td>
                      </tr>
                    ) : restaurants.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-8 text-center text-[#9a6c4c]"
                        >
                          Nenhum restaurante encontrado
                        </td>
                      </tr>
                    ) : (
                      restaurants.map((restaurant) => (
                        <tr
                          key={restaurant.id}
                          className="border-b border-[#e7d9cf] hover:bg-[#f8f7f6] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-[#1b130d] font-medium">
                              {restaurant.name}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[#1b130d] text-sm">
                              {restaurant.owner?.name || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[#1b130d] text-sm">
                              {restaurant.phone ||
                                restaurant.owner?.phone ||
                                "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[#1b130d] text-sm">
                              R$ {restaurant.deliveryFee?.toFixed(2) || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[#1b130d] text-sm max-w-xs truncate">
                              {formatOpeningHours(restaurant.openingHours)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                restaurant.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {restaurant.isActive ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-[#9a6c4c]">
                            {formatDate(restaurant.createdAt)}
                          </td>
                          <td className="px-3 py-3 text-xs text-[#9a6c4c]">
                            {formatDate(restaurant.updatedAt)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/restaurantes/editar?id=${restaurant.id}`
                                )
                              }
                              className="px-3 py-1 text-[#ee7c2b] font-medium hover:text-[#ee7c2b]/80 transition-colors"
                            >
                              Editar
                            </button>
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
