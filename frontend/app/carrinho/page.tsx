"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cartService } from "@/services/cartService";
import { logger } from "@/lib/logger";
import { Cart, CartItem } from "@/types";
import { PageHeader } from "@/components/PageHeader";

export default function CarrinhoPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchCart();
  }, [user, router]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      logger.error("Erro ao carregar carrinho", err);
      setError("Erro ao carregar carrinho");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(itemId);
      return;
    }

    try {
      setUpdating(itemId);
      setError("");
      await cartService.updateItem(itemId, newQuantity);
      await fetchCart();
      setSuccess("Quantidade atualizada");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      logger.error("Erro ao atualizar quantidade", err);
      setError("Erro ao atualizar quantidade");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setUpdating(itemId);
      setError("");
      await cartService.removeItem(itemId);
      await fetchCart();
      setSuccess("Produto removido do carrinho");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      logger.error("Erro ao remover item", err);
      setError("Erro ao remover item");
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Tem certeza que deseja limpar todo o carrinho?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await cartService.clearCart();
      setCart(null);
      setSuccess("Carrinho limpo com sucesso");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      logger.error("Erro ao limpar carrinho", err);
      setError("Erro ao limpar carrinho");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee7c2b]"></div>
          <p className="mt-4 text-gray-600">Carregando carrinho...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6]">
      <PageHeader title="Meu Carrinho" backHref="/" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">
              Seu carrinho está vazio
            </p>
            <Link
              href="/"
              className="inline-block bg-[#ee7c2b] hover:bg-[#d66a1f] text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itens do Carrinho */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-[#e7d9cf]">
                  <h2 className="text-xl font-bold text-[#1b130d]">
                    Produtos ({cart.items.length})
                  </h2>
                </div>

                <div className="divide-y divide-[#e7d9cf]">
                  {cart.items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-[#faf9f8] transition flex items-start gap-4"
                    >
                      {/* Imagem do Produto */}
                      {item.product.imageUrl ? (
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-24 w-24 object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-24 w-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            Sem imagem
                          </span>
                        </div>
                      )}

                      {/* Informações do Produto */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-[#1b130d]">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                        <p className="text-[#ee7c2b] font-bold mt-2">
                          R$ {item.product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Controles */}
                      <div className="flex-shrink-0 text-right">
                        {/* Quantidade */}
                        <div className="flex items-center gap-2 border border-[#e7d9cf] rounded inline-flex mb-4">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={updating === item.id}
                            className="px-3 py-2 text-gray-600 hover:text-[#ee7c2b] disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="px-4 py-2 font-semibold text-[#1b130d] min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={updating === item.id}
                            className="px-3 py-2 text-gray-600 hover:text-[#ee7c2b] disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <p className="text-lg font-bold text-[#1b130d] mb-4">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Remover */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50 transition"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ações */}
                <div className="p-6 bg-[#faf9f8] border-t border-[#e7d9cf] flex gap-4">
                  <Link
                    href="/"
                    className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-[#1b130d] font-bold py-3 px-6 rounded-lg transition"
                  >
                    Continuar Comprando
                  </Link>
                  <button
                    onClick={handleClearCart}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-6 rounded-lg transition"
                  >
                    Limpar Carrinho
                  </button>
                </div>
              </div>
            </div>

            {/* Resumo do Carrinho */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-bold text-[#1b130d] mb-6">
                  Resumo do Pedido
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>
                      R${" "}
                      {cart.items
                        .reduce(
                          (sum, item: CartItem) =>
                            sum + item.product.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxa de entrega:</span>
                    <span>A calcular no checkout</span>
                  </div>
                  <div className="border-t border-[#e7d9cf] pt-4 flex justify-between font-bold text-lg text-[#1b130d]">
                    <span>Total:</span>
                    <span>
                      R${" "}
                      {cart.items
                        .reduce(
                          (sum, item: CartItem) =>
                            sum + item.product.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#ee7c2b] hover:bg-[#d66a1f] text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  Ir para Checkout
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  A taxa de entrega será calculada no checkout de acordo com seu
                  endereço
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
