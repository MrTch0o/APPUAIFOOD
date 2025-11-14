// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  is2FAEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  success: boolean;
  timestamp: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  imageUrl?: string;
  category: string;
  available: boolean;
  isAvailable?: boolean;
  restaurantId: string;
  restaurant?: Restaurant;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
  productId: string;
  cartId: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// Address Types
export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PIX = "PIX",
  CASH = "CASH",
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
  productId: string;
  orderId: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  userId: string;
  user?: User;
  restaurantId: string;
  restaurant?: Restaurant;
  addressId: string;
  address?: Address;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  user?: User;
  restaurantId: string;
  restaurant?: Restaurant;
  orderId: string;
  order?: Order;
  createdAt: string;
  updatedAt: string;
}
