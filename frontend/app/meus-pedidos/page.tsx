"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { logger } from "@/lib/logger";
import { Order, OrderStatus } from "@/types";
import { PageHeader } from "@/components/PageHeader";

export default function MeusPedidosPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getAll();
      setOrders(ordersData);
      logger.info("Pedidos carregados com sucesso", {
        count: ordersData.length,
      });
    } catch (err) {
      logger.error("Erro ao carregar pedidos", err);
      setError("Erro ao carregar seus pedidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) {
      return;
    }

    try {
      setCancelling(orderId);
      await orderService.cancel(orderId);
      await fetchOrders();
      setExpandedOrderId(null);
      logger.info("Pedido cancelado com sucesso", { orderId });
    } catch (err) {
      logger.error("Erro ao cancelar pedido", err);
      setError("Erro ao cancelar pedido. Tente novamente.");
    } finally {
      setCancelling(null);
    }
  };

  const filteredOrders: Order[] = selectedStatus
    ? orders.filter((order) => order.status === selectedStatus)
    : orders;

  const statusLabels: Record<OrderStatus, string> = {
    PENDING: "Aguardando",
    CONFIRMED: "Confirmado",
    PREPARING: "Preparando",
    OUT_FOR_DELIVERY: "Em Entrega",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  };

  const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
    PENDING: { bg: "bg-yellow-50", text: "text-yellow-700" },
    CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700" },
    PREPARING: { bg: "bg-purple-50", text: "text-purple-700" },
    OUT_FOR_DELIVERY: { bg: "bg-orange-50", text: "text-orange-700" },
    DELIVERED: { bg: "bg-green-50", text: "text-green-700" },
    CANCELLED: { bg: "bg-red-50", text: "text-red-700" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6]">
        <PageHeader title="Meus Pedidos" backHref="/" />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee7c2b]"></div>
          <p className="mt-4 text-gray-600">Carregando seus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6]">
      <PageHeader title="Meus Pedidos" backHref="/" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filtros */}
        {orders.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 font-medium mb-3">
              Filtrar por status:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus("")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedStatus === ""
                    ? "bg-[#ee7c2b] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Todos ({orders.length})
              </button>
              {(Object.entries(statusLabels) as [OrderStatus, string][]).map(
                ([status, label]) => {
                  const count = orders.filter(
                    (o) => o.status === status
                  ).length;
                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedStatus === status
                          ? "bg-[#ee7c2b] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Lista de Pedidos */}
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg mb-6">
              {orders.length === 0
                ? "Você ainda não tem nenhum pedido"
                : "Nenhum pedido com esse status"}
            </p>
            <Link
              href="/"
              className="inline-block bg-[#ee7c2b] hover:bg-[#d66a1f] text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Fazer Pedido Agora
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(filteredOrders) &&
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {/* Cabeçalho do Pedido */}
                  <div
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order.id ? null : order.id
                      )
                    }
                    className="p-4 cursor-pointer hover:bg-[#faf9f8] transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-bold text-[#1b130d]">
                            Pedido #{order.id.substring(0, 8).toUpperCase()}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              statusColors[order.status as OrderStatus].bg
                            } ${
                              statusColors[order.status as OrderStatus].text
                            }`}
                          >
                            {statusLabels[order.status as OrderStatus]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.restaurant?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#ee7c2b]">
                          R$ {order.total.toFixed(2)}
                        </p>
                        <svg
                          className={`w-6 h-6 text-gray-400 transition transform ${
                            expandedOrderId === order.id ? "rotate-180" : ""
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

                  {/* Detalhes Expandidos */}
                  {expandedOrderId === order.id && (
                    <div className="border-t border-[#e7d9cf] p-4 bg-[#faf9f8]">
                      {/* Itens */}
                      <div className="mb-6">
                        <h3 className="font-bold text-[#1b130d] mb-3">
                          Itens:
                        </h3>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.product.name} x{item.quantity}
                              </span>
                              <span className="font-semibold">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Endereço de Entrega */}
                      <div className="mb-6">
                        <h3 className="font-bold text-[#1b130d] mb-2">
                          Endereço de Entrega:
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.address?.street}, {order.address?.number}
                          {order.address?.complement &&
                            ` - ${order.address.complement}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.address?.neighborhood}, {order.address?.city} -{" "}
                          {order.address?.state} {order.address?.zipCode}
                        </p>
                      </div>

                      {/* Contato do Restaurante */}
                      {order.restaurant?.phone && (
                        <div className="mb-6">
                          <h3 className="font-bold text-[#1b130d] mb-2">
                            Contato:
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.restaurant.phone}
                          </p>
                        </div>
                      )}

                      {/* Totais */}
                      <div className="border-t border-[#e7d9cf] pt-4 mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Subtotal:</span>
                          <span>
                            R$ {(order.total - order.deliveryFee).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span>Taxa de entrega:</span>
                          <span>R$ {order.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-[#ee7c2b]">
                            R$ {order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-3">
                        <Link
                          href={`/confirmacao-pedido/${order.id}`}
                          className="flex-1 text-center bg-[#ee7c2b] hover:bg-[#d66a1f] text-white font-bold py-2 px-4 rounded transition"
                        >
                          Ver Detalhes
                        </Link>
                        {order.status === OrderStatus.PENDING && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancelling === order.id}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded transition disabled:opacity-50"
                          >
                            {cancelling === order.id
                              ? "Cancelando..."
                              : "Cancelar"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
