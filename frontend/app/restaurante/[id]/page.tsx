"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { restaurantService } from "@/services/restaurantService";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { logger } from "@/lib/logger";
import { Toast } from "@/components/Toast";
import { Restaurant, Product } from "@/types";

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const loadRestaurantAndProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const restaurantId =
        typeof params.id === "string" ? params.id : params.id?.[0];

      if (!restaurantId) {
        logger.warn("ID do restaurante inválido");
        setError("ID do restaurante inválido");
        setLoading(false);
        return;
      }

      logger.info("Carregando detalhes do restaurante", { restaurantId });

      const [restaurantData, productsData] = await Promise.all([
        restaurantService.getById(restaurantId),
        productService.getByRestaurantId(restaurantId),
      ]);

      logger.info("Restaurante e produtos carregados com sucesso", {
        restaurantName: restaurantData.name,
        productCount: Array.isArray(productsData) ? productsData.length : 0,
      });

      setRestaurant(restaurantData);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      logger.error("Erro ao carregar restaurante", err);
      setError("Não foi possível carregar o restaurante");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params?.id) {
      loadRestaurantAndProducts();
    }
  }, [params?.id, loadRestaurantAndProducts]);

  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddToCart = useCallback(
    async (productId: string, productName: string) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setAddingToCartId(productId);
        setToast(null);

        await cartService.addItem(productId, 1);

        setToast({
          message: `${productName} adicionado ao carrinho!`,
          type: "success",
        });

        logger.info("Produto adicionado ao carrinho com sucesso", {
          productId,
          productName,
        });
      } catch (err: any) {
        logger.error("Erro ao adicionar produto ao carrinho", err);

        const errorMessage = err.response?.data?.message || "Erro desconhecido";

        if (
          errorMessage.includes("mesmo restaurante") ||
          errorMessage.includes("Limpe o carrinho")
        ) {
          setToast({
            message:
              "Já tem itens de outro restaurante no carrinho. Limpe o carrinho para adicionar produtos deste restaurante.",
            type: "error",
          });
        } else {
          setToast({
            message: errorMessage,
            type: "error",
          });
        }
      } finally {
        setAddingToCartId(null);
      }
    },
    [user, router]
  );

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex justify-center items-center p-8">
          <p className="text-[#9a6c4c]">Carregando restaurante...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
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
                    {error || "Restaurante não encontrado"}
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

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="flex w-full max-w-6xl flex-col px-4">
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
              <div className="flex gap-2">
                {user ? (
                  <>
                    <Link href="/meus-pedidos">
                      <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f3ece7] text-[#1b130d] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#ee7c2b]/20 transition-colors">
                        <span className="material-symbols-outlined text-xl">
                          person
                        </span>
                      </button>
                    </Link>
                    <Link href="/carrinho">
                      <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f3ece7] text-[#1b130d] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#ee7c2b]/20 transition-colors">
                        <span className="material-symbols-outlined text-xl">
                          shopping_cart
                        </span>
                      </button>
                    </Link>
                  </>
                ) : (
                  <Link href="/login">
                    <button className="flex h-10 px-4 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#ee7c2b] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#ee7c2b]/90 transition-colors">
                      Entrar
                    </button>
                  </Link>
                )}
              </div>
            </header>

            {/* Restaurant Header */}
            <div className="mb-8">
              <div className="relative h-64 w-full overflow-hidden rounded-lg mb-4">
                <img
                  alt={restaurant.name}
                  className="h-full w-full object-cover"
                  src={
                    restaurant.image ||
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop"
                  }
                />
              </div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-[#1b130d] mb-2">
                    {restaurant.name}
                  </h1>
                  <p className="text-[#9a6c4c] text-lg mb-3">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center gap-4 text-[#9a6c4c]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">star</span>
                      <span className="font-semibold text-[#1b130d]">
                        {restaurant.rating || "4.5"}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">
                        schedule
                      </span>
                      <span>{restaurant.deliveryTime || "30-45 min"}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">
                        local_shipping
                      </span>
                      <span>
                        R$ {restaurant.deliveryFee?.toFixed(2) || "5,00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <label className="flex h-12 w-full flex-col">
                <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
                  <div className="flex items-center justify-center rounded-l-lg border-r-0 border-none bg-[#f3ece7] pl-4 text-[#9a6c4c]">
                    <span className="material-symbols-outlined text-2xl">
                      search
                    </span>
                  </div>
                  <input
                    className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border-l-0 border-none bg-[#f3ece7] px-4 pl-2 text-base font-normal leading-normal text-[#1b130d] placeholder:text-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 focus:border-none"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* Section Title */}
            <h2 className="text-[#1b130d] pb-4 text-2xl font-bold leading-tight tracking-[-0.015em]">
              Cardápio
            </h2>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-[#9a6c4c]">
                  {products.length === 0
                    ? "Nenhum produto disponível"
                    : "Nenhum produto encontrado"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={
                          product.image ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
                        }
                      />
                      {!product.available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="text-white font-bold">
                            Indisponível
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 p-4 flex-1">
                      <div>
                        <h3 className="text-base font-bold leading-tight text-[#1b130d] mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#9a6c4c] line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-lg font-bold text-[#ee7c2b]">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product.id, product.name)}
                          disabled={!product.available || addingToCartId === product.id}
                          className="flex h-10 px-4 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#ee7c2b] text-white text-sm font-bold hover:bg-[#ee7c2b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCartId === product.id ? (
                            <span className="material-symbols-outlined text-lg animate-spin">
                              loading
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-lg">
                              add_shopping_cart
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-solid border-[#e7d9cf] px-4 py-8 bg-white">
          <div className="flex w-full justify-center">
            <div className="flex w-full max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1b130d]">UAIFOOD</h3>
                <p className="text-sm text-[#9a6c4c]">
                  © 2025. All Rights Reserved.
                </p>
              </div>
              <div className="flex gap-6 text-sm">
                <a
                  className="text-[#9a6c4c] hover:text-[#ee7c2b] transition-colors"
                  href="#"
                >
                  Sobre Nós
                </a>
                <a
                  className="text-[#9a6c4c] hover:text-[#ee7c2b] transition-colors"
                  href="#"
                >
                  Contato
                </a>
                <a
                  className="text-[#9a6c4c] hover:text-[#ee7c2b] transition-colors"
                  href="#"
                >
                  FAQ
                </a>
              </div>
              </div>
            </div>
        </footer>
      </div>
    </div>

    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
  );
}