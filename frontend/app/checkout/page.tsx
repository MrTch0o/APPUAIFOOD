"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { logger } from "@/lib/logger";
import { Cart, CartItem, Address, PaymentMethod } from "@/types";
import { PageHeader } from "@/components/PageHeader";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);

  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cartData, addressesData] = await Promise.all([
        cartService.getCart(),
        addressService.getAll(),
      ]);

      setCart(cartData);
      setAddresses(addressesData);

      // Selecionar endereço padrão ou o primeiro disponível
      const defaultAddress = addressesData.find((a) => a.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressesData.length > 0) {
        setSelectedAddressId(addressesData[0].id);
      }
    } catch (err) {
      logger.error("Erro ao carregar dados do checkout", err);
      setError("Erro ao carregar dados. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !newAddress.label ||
      !newAddress.street ||
      !newAddress.number ||
      !newAddress.neighborhood ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zipCode
    ) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setSubmitting(true);
      const createdAddress = await addressService.create(
        newAddress as Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
      );
      setAddresses([...addresses, createdAddress]);
      setSelectedAddressId(createdAddress.id);
      setShowAddressForm(false);
      setNewAddress({
        label: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false,
      });
      setSuccess("Endereço adicionado com sucesso");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      logger.error("Erro ao adicionar endereço", err);
      setError("Erro ao adicionar endereço. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedAddressId) {
      setError("Selecione um endereço de entrega");
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError("Seu carrinho está vazio");
      return;
    }

    // Obter ID do restaurante do primeiro item
    const restaurantId = (cart.items[0] as CartItem).product.restaurantId;

    try {
      setSubmitting(true);
      const order = await orderService.create({
        addressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
        restaurantId,
      });

      setSuccess("Pedido criado com sucesso!");
      setTimeout(() => {
        router.push(`/confirmacao-pedido/${order.id}`);
      }, 1500);
    } catch (err) {
      logger.error("Erro ao criar pedido", err);
      setError("Erro ao criar pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee7c2b]"></div>
          <p className="mt-4 text-gray-600">Carregando checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f7f6]">
        <PageHeader title="Checkout" backHref="/carrinho" />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 text-lg mb-6">Seu carrinho está vazio</p>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );

  // Obter taxa de entrega do restaurante do primeiro item
  const firstProduct = (cart.items[0] as CartItem).product;
  const deliveryFee = firstProduct.restaurant?.deliveryFee || 5.0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#f8f7f6]">
      <PageHeader title="Checkout" backHref="/carrinho" />

      <div className="max-w-4xl mx-auto px-4 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCreateOrder} className="space-y-6">
              {/* Endereço de Entrega */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#1b130d] mb-4">
                  Endereço de Entrega
                </h2>

                {addresses.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className="flex items-start p-4 border-2 border-[#e7d9cf] rounded-lg cursor-pointer hover:bg-[#faf9f8] transition"
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="mt-1"
                        />
                        <div className="ml-4 flex-grow">
                          <p className="font-semibold text-[#1b130d]">
                            {address.street}, {address.number}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.street}, {address.number}
                            {address.complement && ` - ${address.complement}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.neighborhood}, {address.city} -{" "}
                            {address.state} {address.zipCode}
                          </p>
                          {address.isDefault && (
                            <span className="text-xs bg-[#ee7c2b] text-white px-2 py-1 rounded mt-2 inline-block">
                              Padrão
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-[#ee7c2b] hover:underline font-medium text-sm"
                >
                  {showAddressForm ? "Cancelar" : "+ Adicionar novo endereço"}
                </button>

                {showAddressForm && (
                  <form
                    onSubmit={handleAddAddress}
                    className="mt-4 pt-4 border-t border-[#e7d9cf] space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="label"
                        placeholder="Ex: Casa, Trabalho"
                        value={newAddress.label}
                        onChange={handleAddAddressChange}
                        className="col-span-full px-4 py-2 border border-[#e7d9cf] rounded focus:outline-none focus:border-[#ee7c2b]"
                        required
                      />
                      <input
                        type="text"
                        name="street"
                        placeholder="Rua"
                        value={newAddress.street}
                        onChange={handleAddAddressChange}
                        className="px-4 py-2 border border-[#e7d9cf] rounded focus:outline-none focus:border-[#ee7c2b]"
                        required
                      />
                      <input
                        type="text"
                        name="number"
                        placeholder="Número"
                        value={newAddress.number}
                        onChange={handleAddAddressChange}
                        className="px-4 py-2 border border-[#e7d9cf] rounded focus:outline-none focus:border-[#ee7c2b]"
                        required
                      />
                      <input
                        type="text"
                        name="complement"
                        placeholder="Complemento (opcional)"
                        value={newAddress.complement}
                        onChange={handleAddAddressChange}
                        className="col-span-full px-4 py-2 border border-[#e7d9cf] rounded focus:outline-none focus:border-[#ee7c2b]"
                      />
                      <input
                        type="text"
                        name="neighborhood"
                        placeholder="Bairro"
                        value={newAddress.neighborhood}
                        onChange={handleAddAddressChange}
                        className="px-4 py-2 border border-[#e7d9cf] rounded focus:outline-none focus:border-[#ee7c2b]"
                        required
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="Cidade"
                        value={newAddress.city}
                        onChange={handleAddAddressChange}
                        className="px-4 py-2 border border-[#e7d9cf] rounded focus:outline-none focus:border-[#ee7c2b]"
                        required
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="Estado"
                        value={newAddress.state}
                        onChange={handleAddAddressChange}
                        className="px-4 py-2 border border-[#e7d9cf] rounded focus:outline-none focus:border-[#ee7c2b]"
                        required
                      />
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="CEP"
                        value={newAddress.zipCode}
                        onChange={handleAddAddressChange}
                        className="px-4 py-2 border border-[#e7d9cf] rounded focus:outline-none focus:border-[#ee7c2b]"
                        required
                      />
                      <label className="col-span-full flex items-center">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={newAddress.isDefault}
                          onChange={handleAddAddressChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          Marcar como endereço padrão
                        </span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#ee7c2b] hover:bg-[#d66a1f] text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition"
                    >
                      {submitting ? "Adicionando..." : "Adicionar Endereço"}
                    </button>
                  </form>
                )}
              </div>

              {/* Método de Pagamento */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#1b130d] mb-4">
                  Método de Pagamento
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      value: PaymentMethod.CREDIT_CARD,
                      label: "Cartão de Crédito",
                    },
                    {
                      value: PaymentMethod.DEBIT_CARD,
                      label: "Cartão de Débito",
                    },
                    { value: PaymentMethod.PIX, label: "PIX" },
                    { value: PaymentMethod.CASH, label: "Dinheiro" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center p-4 border-2 border-[#e7d9cf] rounded-lg cursor-pointer hover:bg-[#faf9f8] transition"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={selectedPaymentMethod === method.value}
                        onChange={(e) =>
                          setSelectedPaymentMethod(
                            e.target.value as PaymentMethod
                          )
                        }
                        className="mr-3"
                      />
                      <span className="font-medium text-[#1b130d]">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-[#1b130d] mb-6">
                Resumo do Pedido
              </h3>

              {/* Itens */}
              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                {cart.items.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="space-y-3 mb-6 border-t border-[#e7d9cf] pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de entrega:</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#1b130d]">
                  <span>Total:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={submitting || !selectedAddressId}
                type="submit"
                className="w-full bg-[#ee7c2b] hover:bg-[#d66a1f] text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? "Processando..." : "Confirmar Pedido"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Seu pagamento será processado imediatamente após confirmar o
                pedido
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
