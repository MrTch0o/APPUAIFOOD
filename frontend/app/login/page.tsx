"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email: loginData.email, password: loginData.password });
      // Aguardar um pouco para o state ser atualizado antes de redirecionar
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
      });
      // Aguardar um pouco para o state ser atualizado antes de redirecionar
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8f7f6]">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7d9cf] px-10 py-3">
              <Link href="/" className="flex items-center gap-4 text-[#1b130d]">
                <div className="size-6 text-[#ee7c2b]">
                  <svg
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-[#1b130d] text-lg font-bold leading-tight tracking-[-0.015em]">
                  UAIFOOD
                </h2>
              </Link>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-10">
              <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-lg grid grid-cols-1 md:grid-cols-2 border border-[#e7d9cf]">
                {/* Form Side */}
                <div className="p-8 sm:p-10 flex flex-col">
                  <h1 className="text-[#1b130d] tracking-tight text-[32px] font-bold leading-tight text-left pb-3 pt-6">
                    Bem-vindo de volta!
                  </h1>
                  <p className="text-slate-600 text-base mb-6">
                    Sua próxima refeição está a um clique de distância.
                  </p>

                  {/* Toggle */}
                  <div className="flex px-0 py-3">
                    <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#f3ece7] p-1">
                      <label
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal ${
                          mode === "login"
                            ? "bg-white shadow text-[#1b130d]"
                            : "text-[#9a6c4c]"
                        }`}
                      >
                        <span className="truncate">Login</span>
                        <input
                          checked={mode === "login"}
                          className="invisible w-0"
                          type="radio"
                          value="Entrar"
                          onChange={() => setMode("login")}
                        />
                      </label>
                      <label
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal ${
                          mode === "register"
                            ? "bg-white shadow text-[#1b130d]"
                            : "text-[#9a6c4c]"
                        }`}
                      >
                        <span className="truncate">Criar Conta</span>
                        <input
                          checked={mode === "register"}
                          className="invisible w-0"
                          type="radio"
                          value="Criar Conta"
                          onChange={() => setMode("register")}
                        />
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}

                  {/* Login Form */}
                  {mode === "login" ? (
                    <form
                      className="space-y-6 mt-4"
                      onSubmit={handleLoginSubmit}
                    >
                      <div className="flex max-w-full flex-wrap items-end gap-4 px-0 py-0">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                            E-mail
                          </p>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                            placeholder="Digite seu e-mail"
                            type="email"
                            value={loginData.email}
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </label>
                      </div>
                      <div className="flex max-w-full flex-wrap items-end gap-4 px-0 py-0">
                        <label className="flex flex-col min-w-40 flex-1">
                          <div className="flex justify-between items-center pb-2">
                            <p className="text-[#1b130d] text-base font-medium leading-normal">
                              Senha
                            </p>
                            <a
                              className="text-sm text-[#ee7c2b] hover:underline"
                              href="#"
                            >
                              Esqueceu a senha?
                            </a>
                          </div>
                          <div className="relative flex w-full flex-1 items-stretch">
                            <input
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal pr-12"
                              placeholder="Digite sua senha"
                              type={showPassword ? "text" : "password"}
                              value={loginData.password}
                              onChange={(e) =>
                                setLoginData({
                                  ...loginData,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <button
                              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500"
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <span className="material-symbols-outlined">
                                visibility
                              </span>
                            </button>
                          </div>
                        </label>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-[#ee7c2b]/10 p-3">
                        <span className="material-symbols-outlined text-[#ee7c2b] text-xl">
                          shield
                        </span>
                        <p className="text-sm text-[#ee7c2b]/80">
                          Para sua segurança, um código de verificação será
                          enviado para seu e-mail.
                        </p>
                      </div>
                      <button
                        className="w-full flex items-center justify-center h-14 px-6 py-3 rounded-lg bg-[#ee7c2b] text-white text-base font-bold hover:bg-[#ee7c2b]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ee7c2b] transition-colors disabled:opacity-50"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Entrando..." : "Entrar"}
                      </button>
                    </form>
                  ) : (
                    <form
                      className="space-y-6 mt-4"
                      onSubmit={handleRegisterSubmit}
                    >
                      <div className="flex max-w-full flex-wrap items-end gap-4 px-0 py-0">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                            Nome Completo
                          </p>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                            placeholder="Digite seu nome completo"
                            value={registerData.name}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </label>
                      </div>
                      <div className="flex max-w-full flex-wrap items-end gap-4 px-0 py-0">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                            E-mail
                          </p>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                            placeholder="Digite seu e-mail"
                            type="email"
                            value={registerData.email}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </label>
                      </div>
                      <div className="flex max-w-full flex-wrap items-end gap-4 px-0 py-0">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                            Telefone
                          </p>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                            placeholder="Digite seu telefone"
                            type="tel"
                            value={registerData.phone}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="flex max-w-full flex-wrap items-end gap-4 px-0 py-0">
                        <label className="flex flex-col min-w-40 flex-1">
                          <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                            Senha
                          </p>
                          <div className="relative flex w-full flex-1 items-stretch">
                            <input
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal pr-12"
                              placeholder="Crie uma senha"
                              type={showPassword ? "text" : "password"}
                              value={registerData.password}
                              onChange={(e) =>
                                setRegisterData({
                                  ...registerData,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <button
                              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500"
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <span className="material-symbols-outlined">
                                visibility
                              </span>
                            </button>
                          </div>
                        </label>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-[#ee7c2b]/10 p-3">
                        <span className="material-symbols-outlined text-[#ee7c2b] text-xl">
                          shield
                        </span>
                        <p className="text-sm text-[#ee7c2b]/80">
                          Suas informações estão seguras conosco.
                        </p>
                      </div>
                      <button
                        className="w-full flex items-center justify-center h-14 px-6 py-3 rounded-lg bg-[#ee7c2b] text-white text-base font-bold hover:bg-[#ee7c2b]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ee7c2b] transition-colors disabled:opacity-50"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Criando conta..." : "Criar Conta"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Image Side */}
                <div className="hidden md:block relative bg-[#f3ece7] p-12">
                  <div className="relative w-full h-full">
                    <Image
                      alt="Food delivery illustration"
                      className="object-cover rounded-lg"
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1000&fit=crop"
                      fill
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
