'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { ownerService } from '@/services/ownerService';

interface Restaurant {
  id: string;
  name: string;
  restaurantCategoryId?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product?: {
    name: string;
    description?: string;
  };
}

interface Order {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  userId: string;
  restaurantId: string;
  addressId: string;
  user?: {
    name: string;
    email?: string;
    phone?: string;
  };
  items?: OrderItem[];
  address?: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<Order['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  OUT_FOR_DELIVERY: 'Saindo para Entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const STATUS_PROGRESSION: Record<Order['status'], Order['status'][]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function OwnerOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authContext = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    searchParams.get('restaurantId') || ''
  );
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authContext?.user) {
      router.push('/login');
      return;
    }

    if (authContext.user.role !== 'RESTAURANT_OWNER') {
      router.push('/');
      return;
    }

    loadRestaurants();
  }, [authContext, router]);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [selectedRestaurantId, statusFilter]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ownerService.getMyRestaurants();
      setRestaurants(data);

      if (searchParams.get('restaurantId')) {
        setSelectedRestaurantId(searchParams.get('restaurantId')!);
      } else if (data.length > 0) {
        setSelectedRestaurantId(data[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar restaurantes:', err);
      setError('Erro ao carregar restaurantes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!selectedRestaurantId) return;

    try {
      setError(null);
      const data = await ownerService.getRestaurantOrders(
        selectedRestaurantId,
        statusFilter || undefined
      );
      setOrders(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError('Erro ao carregar pedidos. Tente novamente.');
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingOrderId(orderId);
      await ownerService.updateOrderStatus(orderId, newStatus);
      loadOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status do pedido. Tente novamente.');
    } finally {
      setUpdatingOrderId(null);
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
            <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
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
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {restaurants.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-2">
                Restaurante
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

          <div className="bg-white rounded-lg shadow-md p-4">
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pedidos */}
        {selectedRestaurantId ? (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">Nenhum pedido encontrado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Cabeçalho do Pedido */}
                    <div
                      className="p-6 cursor-pointer border-b border-gray-200 hover:bg-gray-50"
                      onClick={() =>
                        setSelectedOrder(selectedOrder?.id === order.id ? null : order)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Pedido #</p>
                              <p className="font-mono font-semibold text-gray-900">
                                {order.id.slice(0, 8).toUpperCase()}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500">Cliente</p>
                              <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500">Data</p>
                              <p className="font-medium text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-xl font-bold text-gray-900">
                              R$ {order.total.toFixed(2)}
                            </p>
                          </div>

                          <div
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              STATUS_COLORS[order.status]
                            }`}
                          >
                            {STATUS_LABELS[order.status]}
                          </div>

                          <div className="text-gray-400">
                            <svg
                              className={`w-5 h-5 transition-transform ${
                                selectedOrder?.id === order.id ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Expandidos */}
                    {selectedOrder?.id === order.id && (
                      <div className="p-6 space-y-6 border-t border-gray-200 bg-gray-50">
                        {/* Itens do Pedido */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Itens do Pedido</h4>
                          <div className="space-y-3">
                            {order.items?.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-start bg-white p-3 rounded border border-gray-200"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item.product?.name || `Produto #${item.productId.slice(0, 8)}`}
                                  </p>
                                  {item.product?.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {item.product.description}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500 mt-2">
                                    Quantidade: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Endereço de Entrega */}
                        {order.address && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Endereço de Entrega
                            </h4>
                            <div className="bg-white p-4 rounded border border-gray-200">
                              <p className="text-gray-900">
                                {order.address.street}, {order.address.number}
                              </p>
                              {order.address.complement && (
                                <p className="text-gray-700">{order.address.complement}</p>
                              )}
                              <p className="text-gray-700">
                                {order.address.city}, {order.address.state} - {order.address.zipCode}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Resumo Financeiro */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Resumo Financeiro</h4>
                          <div className="bg-white p-4 rounded border border-gray-200 space-y-2">
                            <div className="flex justify-between text-gray-700">
                              <span>Subtotal:</span>
                              <span>R$ {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                              <span>Taxa de Entrega:</span>
                              <span>R$ {order.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                              <span>Total:</span>
                              <span>R$ {order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm mt-2">
                              <span>Método de Pagamento:</span>
                              <span>{order.paymentMethod}</span>
                            </div>
                          </div>
                        </div>

                        {/* Informações do Cliente */}
                        {order.user && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Informações do Cliente</h4>
                            <div className="bg-white p-4 rounded border border-gray-200 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-700">Nome:</span>
                                <span className="text-gray-900 font-medium">{order.user.name}</span>
                              </div>
                              {order.user.email && (
                                <div className="flex justify-between">
                                  <span className="text-gray-700">Email:</span>
                                  <span className="text-gray-900 font-medium">{order.user.email}</span>
                                </div>
                              )}
                              {order.user.phone && (
                                <div className="flex justify-between">
                                  <span className="text-gray-700">Telefone:</span>
                                  <span className="text-gray-900 font-medium">{order.user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Atualizações de Status */}
                        {STATUS_PROGRESSION[order.status].length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Próximas Ações</h4>
                            <div className="flex gap-2 flex-wrap">
                              {STATUS_PROGRESSION[order.status].map((nextStatus) => (
                                <button
                                  key={nextStatus}
                                  onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                  disabled={updatingOrderId === order.id}
                                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    nextStatus === 'CANCELLED'
                                      ? 'bg-red-500 hover:bg-red-600 text-white'
                                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                                  } disabled:opacity-50`}
                                >
                                  {updatingOrderId === order.id ? 'Atualizando...' : STATUS_LABELS[nextStatus]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {STATUS_PROGRESSION[order.status].length === 0 && (
                          <div className="p-4 bg-gray-200 rounded-lg text-gray-700">
                            <p>Este pedido não pode ser alterado neste status.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">Selecione um restaurante para visualizar seus pedidos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
