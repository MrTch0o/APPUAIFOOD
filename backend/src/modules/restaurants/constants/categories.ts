export enum RestaurantCategory {
  PIZZARIA = 'Pizzaria',
  HAMBURGUERIA = 'Hamburgueria',
  BRASILEIRA = 'Brasileira',
  JAPONESA = 'Japonesa',
  MARMITAS = 'Marmitas',
  SOBREMESAS = 'Sobremesas',
}

export const CATEGORY_LABELS: Record<RestaurantCategory, string> = {
  [RestaurantCategory.PIZZARIA]: 'Pizzaria',
  [RestaurantCategory.HAMBURGUERIA]: 'Hamburgueria',
  [RestaurantCategory.BRASILEIRA]: 'Brasileira',
  [RestaurantCategory.JAPONESA]: 'Japonesa',
  [RestaurantCategory.MARMITAS]: 'Marmitas',
  [RestaurantCategory.SOBREMESAS]: 'Sobremesas',
};

export const VALID_CATEGORIES = Object.values(RestaurantCategory);
