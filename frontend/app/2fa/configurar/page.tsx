"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { logger } from "@/lib/logger";

export default function Configure2FAPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<"start" | "qr" | "confirm">("start");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (user && user.is2FAEnabled) {
      setError("2FA já está ativado para sua conta");
      setTimeout(() => router.push("/perfil"), 2000);
    }
  }, [user, router]);

  const handleGenerateQR = async () => {
    setError("");
    setLoading(true);

    try {
      logger.info("Gerando QR code para 2FA");

      const response = await api.post<{
        success: boolean;
        data: {
          secret: string;
          qrCode: string;
          message: string;
        };
        timestamp: string;
      }>("/auth/2fa/generate");

      setSecret(response.data.data.secret);
      setQrCode(response.data.data.qrCode);
      setStep("qr");

      logger.info("QR code gerado com sucesso");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        error.response?.data?.message || "Erro ao gerar QR code";
      logger.error("Erro ao gerar QR code", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (token.length !== 6 || !/^\d+$/.test(token)) {
      setError("O código deve conter exatamente 6 dígitos");
      return;
    }

    setConfirming(true);

    try {
      logger.info("Confirmando código 2FA");

      await api.post("/auth/2fa/enable", {
        token,
      });

      setSuccess("2FA ativado com sucesso! Você agora é mais seguro.");
      logger.info("2FA ativado com sucesso");

      setTimeout(() => {
        router.push("/perfil");
      }, 2000);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        error.response?.data?.message || "Código 2FA inválido";
      logger.error("Erro ao confirmar 2FA", { error: errorMessage });
      setError(errorMessage);
      setConfirming(false);
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
          <div className="flex w-full max-w-2xl flex-col px-4">
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
                Ativar Autenticação de Dois Fatores
              </h1>
              <p className="text-[#9a6c4c]">
                Aumente a segurança da sua conta com 2FA usando Google
                Authenticator
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Step 1: Start */}
            {step === "start" && (
              <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1b130d] mb-4">
                      O que é Autenticação de Dois Fatores?
                    </h2>
                    <p className="text-[#9a6c4c] mb-4">
                      2FA adiciona uma camada extra de segurança à sua conta.
                      Além de sua senha, você precisará de um código único
                      gerado pelo seu celular para fazer login.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#f3ece7] rounded-lg">
                      <div className="text-3xl mb-2">📱</div>
                      <h3 className="font-bold text-[#1b130d] mb-2">
                        Instale um App
                      </h3>
                      <p className="text-sm text-[#9a6c4c]">
                        Google Authenticator, Authy ou Microsoft Authenticator
                      </p>
                    </div>

                    <div className="p-4 bg-[#f3ece7] rounded-lg">
                      <div className="text-3xl mb-2">📷</div>
                      <h3 className="font-bold text-[#1b130d] mb-2">
                        Escaneie
                      </h3>
                      <p className="text-sm text-[#9a6c4c]">
                        O QR code com seu celular
                      </p>
                    </div>

                    <div className="p-4 bg-[#f3ece7] rounded-lg">
                      <div className="text-3xl mb-2">🔐</div>
                      <h3 className="font-bold text-[#1b130d] mb-2">Seguro</h3>
                      <p className="text-sm text-[#9a6c4c]">
                        Códigos únicos a cada 30 segundos
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateQR}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-[#ee7c2b] text-white font-bold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Gerando..." : "Próximo: Gerar QR Code"}
                  </button>

                  <Link href="/perfil">
                    <button
                      type="button"
                      className="w-full px-6 py-2 bg-[#f3ece7] text-[#1b130d] font-medium rounded-lg hover:bg-[#e7d9cf] transition-colors"
                    >
                      Cancelar
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Step 2: QR Code */}
            {step === "qr" && (
              <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                <h2 className="text-2xl font-bold text-[#1b130d] mb-6 text-center">
                  Escaneie o QR Code
                </h2>

                <div className="bg-[#f3ece7] p-6 rounded-lg mb-6 flex items-center justify-center">
                  {qrCode && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrCode} alt="QR Code 2FA" className="w-64 h-64" />
                  )}
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-bold text-[#1b130d] mb-2">
                    Não consegue escanear?
                  </h3>
                  <p className="text-sm text-[#9a6c4c] mb-3">
                    Digite este código manualmente no seu app autenticador:
                  </p>
                  <div className="bg-white p-3 rounded border border-[#e7d9cf] font-mono text-center text-lg tracking-widest text-[#1b130d]">
                    {secret}
                  </div>
                </div>

                <button
                  onClick={() => setStep("confirm")}
                  className="w-full px-6 py-3 bg-[#ee7c2b] text-white font-bold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors mb-3"
                >
                  Próximo: Confirmar Código
                </button>

                <button
                  onClick={() => setStep("start")}
                  className="w-full px-6 py-2 bg-[#f3ece7] text-[#1b130d] font-medium rounded-lg hover:bg-[#e7d9cf] transition-colors"
                >
                  Voltar
                </button>
              </div>
            )}

            {/* Step 3: Confirm Code */}
            {step === "confirm" && (
              <form
                onSubmit={handleConfirm}
                className="bg-white rounded-xl shadow-md p-8 mb-6"
              >
                <h2 className="text-2xl font-bold text-[#1b130d] mb-6 text-center">
                  Confirme seu Código
                </h2>

                <p className="text-center text-[#9a6c4c] mb-6">
                  Abra seu app autenticador e digite o código de 6 dígitos para
                  confirmar
                </p>

                <div className="mb-6">
                  <label className="block text-[#1b130d] font-bold mb-3 text-center">
                    Código de Verificação
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

                <button
                  type="submit"
                  disabled={confirming || token.length !== 6}
                  className="w-full px-6 py-3 bg-[#ee7c2b] text-white font-bold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  {confirming ? "Verificando..." : "Ativar 2FA"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("qr")}
                  className="w-full px-6 py-2 bg-[#f3ece7] text-[#1b130d] font-medium rounded-lg hover:bg-[#e7d9cf] transition-colors"
                >
                  Voltar
                </button>
              </form>
            )}

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-[#1b130d] mb-2">
                ⚠️ Importante
              </h3>
              <p className="text-sm text-[#9a6c4c]">
                Guarde bem seu app autenticador. Se perder acesso, não
                conseguirá fazer login. Recomendamos anotar o código acima em um
                lugar seguro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
