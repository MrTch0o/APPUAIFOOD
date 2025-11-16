"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";

export default function OwnerDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user || user.role !== "RESTAURANT_OWNER") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Painel do Proprietário"
          subtitle="Gerencie seus restaurantes, produtos e pedidos"
          backHref="/"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/owner/restaurantes">
            <div className="h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-orange-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Meus Restaurantes
                </h2>
                <span className="text-3xl">🏪</span>
              </div>
              <p className="text-gray-600">
                Gerencie seus restaurantes, edite informações e visualize
                detalhes
              </p>
            </div>
          </Link>

          <Link href="/owner/produtos">
            <div className="h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Produtos</h2>
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-gray-600">
                Gerencie os produtos dos seus restaurantes, crie, edite e remova
              </p>
            </div>
          </Link>

          <Link href="/owner/pedidos">
            <div className="h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pedidos</h2>
                <span className="text-3xl">📋</span>
              </div>
              <p className="text-gray-600">
                Acompanhe e gerencie os pedidos dos seus clientes em tempo real
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
