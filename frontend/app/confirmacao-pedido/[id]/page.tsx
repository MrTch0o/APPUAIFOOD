"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { logger } from "@/lib/logger";
import { Order, OrderItem } from "@/types";
import PageHeader from "@/components/PageHeader";

export default function ConfirmacaoPedidoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!orderId) {
      setError("ID do pedido não fornecido");
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [user, orderId, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getById(orderId);
      setOrder(orderData);
      logger.info("Pedido carregado com sucesso", { orderId });
    } catch (err) {
      logger.error("Erro ao carregar pedido", err);
      setError("Erro ao carregar dados do pedido. Redirecionando...");
      setTimeout(() => {
        router.push("/meus-pedidos");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee7c2b]"></div>
          <p className="mt-4 text-gray-600">
            Carregando confirmação do pedido...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f8f7f6]">
        <PageHeader title="Confirmação de Pedido" backHref="/" />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
            {error || "Erro ao carregar o pedido"}
          </div>
          <Link
            href="/"
            className="inline-block mt-6 bg-[#ee7c2b] hover:bg-[#d66a1f] text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    PENDING: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      label: "Aguardando Confirmação",
    },
    CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700", label: "Confirmado" },
    PREPARING: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      label: "Sendo Preparado",
    },
    OUT_FOR_DELIVERY: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      label: "Saiu para Entrega",
    },
    DELIVERED: { bg: "bg-green-50", text: "text-green-700", label: "Entregue" },
    CANCELLED: { bg: "bg-red-50", text: "text-red-700", label: "Cancelado" },
  };

  const statusInfo = statusColors[order.status] || statusColors.PENDING;

  return (
    <div className="min-h-screen bg-[#f8f7f6]">
      <PageHeader title="Confirmação de Pedido" backHref="/" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cabeçalho com confirmação */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <div className="mb-6">
            <div className="inline-block">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Pedido Confirmado! 🎉
          </h1>
          <p className="text-gray-600 mb-4">
            Seu pedido foi recebido e está sendo preparado
          </p>
          <div className="bg-gray-50 px-4 py-3 rounded inline-block">
            <p className="text-sm text-gray-600">Número do Pedido</p>
            <p className="text-2xl font-bold text-[#1b130d] font-mono">
              {order.id.substring(0, 8).toUpperCase()}...
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalhes do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-[#1b130d] mb-4">
                Status do Pedido
              </h2>
              <div
                className={`${statusInfo.bg} ${statusInfo.text} p-4 rounded-lg text-center font-semibold`}
              >
                {statusInfo.label}
              </div>

              {/* Timeline de Status */}
              <div className="mt-6 space-y-4">
                {[
                  { status: "PENDING", label: "Pedido Recebido" },
                  { status: "CONFIRMED", label: "Confirmado" },
                  { status: "PREPARING", label: "Sendo Preparado" },
                  { status: "OUT_FOR_DELIVERY", label: "Saiu para Entrega" },
                  { status: "DELIVERED", label: "Entregue" },
                ].map((step, index) => {
                  const isCompleted =
                    [
                      "PENDING",
                      "CONFIRMED",
                      "PREPARING",
                      "OUT_FOR_DELIVERY",
                      "DELIVERED",
                    ].indexOf(order.status) >= index;
                  const isCurrent = step.status === order.status;

                  return (
                    <div key={step.status} className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-[#ee7c2b] text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        {index < 4 && (
                          <div
                            className={`w-1 h-8 ${
                              isCompleted ? "bg-[#ee7c2b]" : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                      <div
                        className={`pt-1 ${
                          isCurrent
                            ? "font-bold text-[#1b130d]"
                            : "text-gray-600"
                        }`}
                      >
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Informações da Entrega */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-[#1b130d] mb-4">
                Informações da Entrega
              </h2>

              <div className="space-y-4">
                {/* Restaurante */}
                <div className="border-b border-[#e7d9cf] pb-4">
                  <p className="text-sm text-gray-600 font-medium">
                    Restaurante
                  </p>
                  <p className="text-lg font-semibold text-[#1b130d]">
                    {order.restaurant?.name}
                  </p>
                  {order.restaurant?.phone && (
                    <p className="text-sm text-gray-600 mt-1">
                      📞 {order.restaurant.phone}
                    </p>
                  )}
                </div>

                {/* Endereço de Entrega */}
                <div className="border-b border-[#e7d9cf] pb-4">
                  <p className="text-sm text-gray-600 font-medium">
                    Endereço de Entrega
                  </p>
                  <p className="text-lg font-semibold text-[#1b130d]">
                    {order.address?.street}, {order.address?.number}
                  </p>
                  {order.address?.complement && (
                    <p className="text-sm text-gray-600">
                      {order.address.complement}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {order.address?.neighborhood}, {order.address?.city} -{" "}
                    {order.address?.state} {order.address?.zipCode}
                  </p>
                </div>

                {/* Método de Pagamento */}
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Método de Pagamento
                  </p>
                  <p className="text-lg font-semibold text-[#1b130d]">
                    {order.paymentMethod === "CREDIT_CARD"
                      ? "Cartão de Crédito"
                      : order.paymentMethod === "DEBIT_CARD"
                      ? "Cartão de Débito"
                      : order.paymentMethod === "PIX"
                      ? "PIX"
                      : "Dinheiro"}
                  </p>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-[#1b130d] mb-4">
                Itens do Pedido
              </h2>

              <div className="space-y-3">
                {order.items.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-3 hover:bg-[#faf9f8] rounded transition"
                  >
                    <div className="flex-grow">
                      <p className="font-semibold text-[#1b130d]">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-gray-500 italic mt-1">
                          Observação: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#ee7c2b]">
                        R$ {item.subtotal.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">
                        R$ {item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold text-[#1b130d] mb-6">
                Resumo Financeiro
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>R$ {order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de entrega:</span>
                  <span>R$ {order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#e7d9cf] pt-3 flex justify-between font-bold text-lg text-[#1b130d]">
                  <span>Total:</span>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-700 font-medium">
                  ✓ Pagamento Confirmado
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Seu pagamento foi processado com sucesso
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/meus-pedidos"
                  className="block text-center bg-[#ee7c2b] hover:bg-[#d66a1f] text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Ver Meus Pedidos
                </Link>
                <Link
                  href="/"
                  className="block text-center bg-gray-200 hover:bg-gray-300 text-[#1b130d] font-bold py-3 px-4 rounded-lg transition"
                >
                  Voltar para Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
