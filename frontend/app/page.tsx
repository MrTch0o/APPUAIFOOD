"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { restaurantService } from "@/services/restaurantService";
import { Restaurant } from "@/types";

export default function Home() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error("Erro ao carregar restaurantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="flex w-full max-w-6xl flex-col px-4">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 mb-6">
              <div className="flex items-center gap-4">
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
              </div>
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
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </header>

            {/* Page Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#1b130d] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                What are you craving today?
              </p>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3">
              <label className="flex h-14 w-full min-w-40 flex-col">
                <div className="flex h-full w-full flex-1 items-stretch rounded-xl">
                  <div className="flex items-center justify-center rounded-l-xl border-r-0 border-none bg-[#f3ece7] pl-4 text-[#9a6c4c]">
                    <span className="material-symbols-outlined text-2xl">
                      search
                    </span>
                  </div>
                  <input
                    className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl border-l-0 border-none bg-[#f3ece7] px-4 pl-2 text-base font-normal leading-normal text-[#1b130d] placeholder:text-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 focus:border-none"
                    placeholder="Search for restaurants or food..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* Category Chips */}
            <div className="w-full overflow-x-auto p-4">
              <div className="flex gap-3 whitespace-nowrap">
                <div className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#ee7c2b] pl-3 pr-4 text-white transition-transform hover:scale-105">
                  <span className="material-symbols-outlined text-xl">
                    local_pizza
                  </span>
                  <p className="text-sm font-medium leading-normal">Pizzas</p>
                </div>
                <div className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f3ece7] pl-3 pr-4 hover:bg-[#ee7c2b]/20 transition-transform hover:scale-105">
                  <span className="material-symbols-outlined text-xl">
                    lunch_dining
                  </span>
                  <p className="text-sm font-medium leading-normal">Burgers</p>
                </div>
                <div className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f3ece7] pl-3 pr-4 hover:bg-[#ee7c2b]/20 transition-transform hover:scale-105">
                  <span className="material-symbols-outlined text-xl">
                    restaurant
                  </span>
                  <p className="text-sm font-medium leading-normal">Marmitas</p>
                </div>
                <div className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f3ece7] pl-3 pr-4 hover:bg-[#ee7c2b]/20 transition-transform hover:scale-105">
                  <span className="material-symbols-outlined text-xl">
                    set_meal
                  </span>
                  <p className="text-sm font-medium leading-normal">Sushi</p>
                </div>
                <div className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f3ece7] pl-3 pr-4 hover:bg-[#ee7c2b]/20 transition-transform hover:scale-105">
                  <span className="material-symbols-outlined text-xl">eco</span>
                  <p className="text-sm font-medium leading-normal">Healthy</p>
                </div>
                <div className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-[#f3ece7] pl-3 pr-4 hover:bg-[#ee7c2b]/20 transition-transform hover:scale-105">
                  <span className="material-symbols-outlined text-xl">
                    icecream
                  </span>
                  <p className="text-sm font-medium leading-normal">Desserts</p>
                </div>
              </div>
            </div>

            {/* Section Title */}
            <h2 className="text-[#1b130d] px-4 pb-3 pt-8 text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Featured Restaurants
            </h2>

            {/* Restaurant Grid */}
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-[#9a6c4c]">Carregando restaurantes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRestaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurante/${restaurant.id}`}
                  >
                    <div className="group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="relative h-40 w-full">
                        <img
                          alt={restaurant.name}
                          className="h-full w-full object-cover"
                          src={
                            restaurant.imageUrl ||
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold leading-tight text-[#1b130d]">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-yellow-500">
                              star
                            </span>
                            <span className="text-sm font-medium text-[#1b130d]">
                              {restaurant.rating || "4.5"}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-[#9a6c4c] line-clamp-2">
                          {restaurant.description || restaurant.address}
                        </p>
                        <div className="flex items-center justify-between text-xs text-[#9a6c4c]">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">
                              schedule
                            </span>
                            <span>
                              {restaurant.deliveryTime || "30-45 min"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">
                              local_shipping
                            </span>
                            <span>
                              R$ {restaurant.deliveryFee?.toFixed(2) || "5,00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && filteredRestaurants.length === 0 && (
              <div className="flex justify-center items-center p-8">
                <p className="text-[#9a6c4c]">Nenhum restaurante encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
