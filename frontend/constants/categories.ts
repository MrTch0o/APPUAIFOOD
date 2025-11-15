/**
 * Categorias de restaurantes disponíveis no sistema
 * Deve estar sincronizado com o backend (seed.ts)
 */
export const RESTAURANT_CATEGORIES = [
  { value: "Pizzaria", label: "Pizzaria" },
  { value: "Hamburgueria", label: "Hamburgueria" },
  { value: "Brasileira", label: "Brasileira" },
  { value: "Japonesa", label: "Japonesa" },
  { value: "Marmitas", label: "Marmitas" },
  { value: "Sobremesas", label: "Sobremesas" },
] as const;

export type RestaurantCategory =
  (typeof RESTAURANT_CATEGORIES)[number]["value"];
