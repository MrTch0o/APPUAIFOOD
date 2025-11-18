"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { logger } from "@/lib/logger";

export default function Verify2FAPage() {
  const router = useRouter();
  const userIdRef = useRef<string>("");

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  useEffect(() => {
    // Recuperar userId da sessionStorage
    const storedUserId = sessionStorage.getItem("2faUserId");
    if (!storedUserId) {
      logger.warn(
        "userId não encontrado em sessionStorage, redirecionando para login"
      );
      router.push("/login");
      return;
    }
    userIdRef.current = storedUserId;
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (token.length !== 6 || !/^\d+$/.test(token)) {
      setError("O código deve conter exatamente 6 dígitos");
      return;
    }

    setLoading(true);

    try {
      logger.info("Verificando código 2FA", { userId: userIdRef.current });

      const response = await api.post<{
        success: boolean;
        data: {
          user: {
            id: string;
            name: string;
            email: string;
            role: string;
          };
          accessToken: string;
          refreshToken: string;
        };
        timestamp: string;
      }>("/auth/2fa/verify", {
        userId: userIdRef.current,
        token,
      });

      logger.info("Código 2FA verificado com sucesso");

      // Salvar tokens
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      // Limpar sessionStorage
      sessionStorage.removeItem("2faUserId");

      // Redirecionar
      router.push("/");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; statusCode?: number } };
      };
      const errorMessage =
        error.response?.data?.message || "Erro ao verificar código 2FA";

      logger.error("Erro ao verificar 2FA", { error: errorMessage });

      if (
        error.response?.data?.statusCode === 401 ||
        errorMessage.includes("inválido")
      ) {
        const newAttempts = Math.max(0, remainingAttempts - 1);
        setRemainingAttempts(newAttempts);

        if (newAttempts === 0) {
          setError(
            "Limite de tentativas excedido. Por favor, faça login novamente."
          );
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setError(`Código inválido. Tentativas restantes: ${newAttempts}`);
        }
      } else {
        setError(errorMessage);
      }

      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setToken(value);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-10">
          <div className="flex w-full max-w-md flex-col px-4">
            {/* Header */}
            <div className="mb-8">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="size-8 text-[#ee7c2b]">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-[#1b130d] text-lg font-bold">UAIFOOD</h2>
              </Link>

              <h1 className="text-4xl font-bold text-[#1b130d] mb-2">
                Verificação 2FA
              </h1>
              <p className="text-[#9a6c4c]">
                Abra seu aplicativo autenticador e digite o código de 6 dígitos
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-md p-6 mb-4"
            >
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Code Input */}
              <div className="mb-6">
                <label className="block text-[#1b130d] font-bold mb-3 text-center">
                  Código de Autenticação
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={handleInputChange}
                  placeholder="000000"
                  maxLength={6}
                  autoComplete="off"
                  inputMode="numeric"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border-2 border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#ccc] focus:outline-0 focus:border-[#ee7c2b] focus:ring-2 focus:ring-[#ee7c2b]/50 font-mono"
                />
              </div>

              {/* Attempts */}
              {remainingAttempts <= 3 && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Tentativas restantes: {remainingAttempts}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || token.length !== 6}
                className="w-full px-6 py-3 bg-[#ee7c2b] text-white font-bold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {loading ? "Verificando..." : "Verificar Código"}
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full px-6 py-2 bg-[#f3ece7] text-[#1b130d] font-medium rounded-lg hover:bg-[#e7d9cf] transition-colors"
              >
                Voltar para Login
              </button>
            </form>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-[#1b130d] mb-2">
                Onde encontrar o código?
              </h3>
              <ul className="text-sm text-[#9a6c4c] space-y-1">
                <li>
                  • Abra Google Authenticator, Authy ou Microsoft Authenticator
                </li>
                <li>• Procure por &quot;UAIFOOD&quot;</li>
                <li>• Digite os 6 dígitos mostrados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
