"use client";

import { useState, useEffect } from "react";
import {
  restaurantCategoryService,
  RestaurantCategory,
} from "@/services/categoryService";
import { logger } from "@/lib/logger";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

// Mapa de ícones para cada categoria (padrão)
const categoryIcons: Record<string, string> = {
  Pizzaria: "local_pizza",
  Hamburgueria: "lunch_dining",
  Marmitas: "restaurant",
  Japonesa: "set_meal",
  Brasileira: "eco",
  Sobremesas: "icecream",
  Italiana: "dining",
  Chinesa: "rice_bowl",
  Mexicana: "local_fire_department",
  Vegetariana: "leaf",
};

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<RestaurantCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await restaurantCategoryService.getAll(true); // true = apenas categorias ativas
      setCategories(data);
    } catch (error) {
      logger.error("Erro ao carregar categorias", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (categoryName: string): string => {
    return categoryIcons[categoryName] || "category";
  };

  if (loading) {
    return (
      <div className="w-full overflow-x-auto p-4">
        <div className="flex gap-3 whitespace-nowrap">
          <div className="h-10 w-20 animate-pulse rounded-lg bg-[#f3ece7]"></div>
          <div className="h-10 w-20 animate-pulse rounded-lg bg-[#f3ece7]"></div>
          <div className="h-10 w-20 animate-pulse rounded-lg bg-[#f3ece7]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto p-4">
      <div className="flex gap-3 whitespace-nowrap">
        {/* Botão "Todos" */}
        <button
          onClick={() => onCategoryChange("")}
          className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg pl-3 pr-4 transition-all hover:scale-105 ${
            selectedCategory === ""
              ? "bg-[#ee7c2b] text-white"
              : "bg-[#f3ece7] text-[#1b130d] hover:bg-[#ee7c2b]/20"
          }`}
          title="Ver todos os restaurantes"
        >
          <span className="material-symbols-outlined text-xl">
            all_inclusive
          </span>
          <p className="text-sm font-medium leading-normal">Todos</p>
        </button>

        {/* Categorias dinâmicas */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg pl-3 pr-4 transition-all hover:scale-105 ${
              selectedCategory === category.id
                ? "bg-[#ee7c2b] text-white"
                : "bg-[#f3ece7] text-[#1b130d] hover:bg-[#ee7c2b]/20"
            }`}
            title={category.description || category.name}
          >
            <span className="material-symbols-outlined text-xl">
              {getIconForCategory(category.name)}
            </span>
            <p className="text-sm font-medium leading-normal">
              {category.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
