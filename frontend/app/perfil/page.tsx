"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { userService, UpdateUserRequest } from "@/services/userService";
import { logger } from "@/lib/logger";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    loadProfile();
  }, [user, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      logger.info("Perfil carregado com sucesso", { user: data });
      setProfile(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      logger.error("Erro ao carregar perfil", error);
      setErrorMessage("Erro ao carregar perfil do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validações
    if (!formData.name || !formData.email) {
      setErrorMessage("Nome e email são obrigatórios");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não correspondem");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      logger.info("Atualizando perfil do usuário", {
        name: formData.name,
        email: formData.email,
      });

      const updateData: UpdateUserRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const result = await userService.updateProfile(updateData);

      logger.info("Perfil atualizado com sucesso", { user: result.user });
      setProfile(result.user);
      setSuccessMessage("Perfil atualizado com sucesso!");
      setEditing(false);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      logger.error("Erro ao atualizar perfil", error);
      setErrorMessage("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Tem certeza que deseja deletar sua conta? Esta ação é irreversível."
      )
    ) {
      return;
    }

    try {
      logger.info("Deletando conta do usuário");
      await userService.deleteAccount();
      logger.info("Conta deletada com sucesso");
      logout();
      // O logout agora não redireciona automaticamente, então fazemos manualmente
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (error) {
      logger.error("Erro ao deletar conta", error);
      setErrorMessage("Erro ao deletar conta. Tente novamente.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validações
    if (
      !changePasswordData.currentPassword ||
      !changePasswordData.newPassword ||
      !changePasswordData.confirmNewPassword
    ) {
      setErrorMessage("Todos os campos são obrigatórios");
      return;
    }

    if (
      changePasswordData.newPassword !== changePasswordData.confirmNewPassword
    ) {
      setErrorMessage("As novas senhas não correspondem");
      return;
    }

    if (changePasswordData.newPassword.length < 6) {
      setErrorMessage("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (changePasswordData.currentPassword === changePasswordData.newPassword) {
      setErrorMessage("A nova senha deve ser diferente da atual");
      return;
    }

    try {
      logger.info("Alterando senha do usuário");
      const result = await userService.changePassword(
        changePasswordData.currentPassword,
        changePasswordData.newPassword
      );

      logger.info("Senha alterada com sucesso");
      setSuccessMessage("Senha alterada com sucesso!");
      setChangePasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowChangePassword(false);

      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      logger.error("Erro ao alterar senha", error);
      const errorMsg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao alterar senha. Verifique a senha atual.";
      setErrorMessage(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-[#9a6c4c]">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-[#9a6c4c]">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6]">
      <div className="flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7d9cf] px-2 md:px-6 lg:px-10 py-3 bg-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f3ece7] text-[#1b130d] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#ee7c2b]/20 transition-colors"
              title="Voltar"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <div className="size-6 text-[#ee7c2b]">
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
              <h2 className="text-[#1b130d] text-lg font-bold leading-tight tracking-[-0.015em]">
                UAIFOOD
              </h2>
            </Link>
          </div>
          <div className="flex gap-2">
            <Link href="/meus-pedidos">
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f3ece7] text-[#1b130d] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#ee7c2b]/20 transition-colors">
                <span className="material-symbols-outlined text-xl">
                  history
                </span>
              </button>
            </Link>
            <Link href="/carrinho">
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f3ece7] text-[#1b130d] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#ee7c2b]/20 transition-colors">
                <span className="material-symbols-outlined text-xl">
                  shopping_cart
                </span>
              </button>
            </Link>
            <button
              onClick={logout}
              className="flex h-10 px-4 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-red-500 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 justify-center py-8">
          <div className="w-full max-w-2xl px-4">
            {/* Profile Header */}
            <div className="mb-8">
              <div className="flex items-center gap-6 bg-white rounded-xl p-6 shadow-sm">
                <div className="size-20 rounded-full bg-[#ee7c2b] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-5xl">
                    account_circle
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1b130d]">
                    {profile.name}
                  </h1>
                  <p className="text-[#9a6c4c]">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-semibold text-white bg-[#ee7c2b] px-3 py-1 rounded-full">
                      {profile.role === "ADMIN" ? "Admin" : "Usuário"}
                    </span>
                    {profile.is2FAEnabled && (
                      <span className="text-xs font-semibold text-white bg-green-600 px-3 py-1 rounded-full">
                        2FA Ativado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700">
                <div className="flex gap-2">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
                <div className="flex gap-2">
                  <span className="material-symbols-outlined">error</span>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Profile Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#1b130d]">
                  Informações Pessoais
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#ee7c2b] text-white rounded-lg hover:bg-[#ee7c2b]/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      edit
                    </span>
                    Editar
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1b130d] mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg bg-[#f8f7f6] text-[#1b130d] placeholder:text-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1b130d] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg bg-[#f8f7f6] text-[#1b130d] placeholder:text-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1b130d] mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg bg-[#f8f7f6] text-[#1b130d] placeholder:text-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1b130d] mb-2">
                      Nova Senha (deixe em branco para manter a atual)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg bg-[#f8f7f6] text-[#1b130d] placeholder:text-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a6c4c] hover:text-[#1b130d]"
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility" : "visibility_off"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {formData.password && (
                    <div>
                      <label className="block text-sm font-medium text-[#1b130d] mb-2">
                        Confirmar Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-[#e7d9cf] rounded-lg bg-[#f8f7f6] text-[#1b130d] placeholder:text-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#ee7c2b] text-white font-semibold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setErrorMessage("");
                        setFormData({
                          name: profile.name || "",
                          email: profile.email || "",
                          phone: profile.phone || "",
                          password: "",
                          confirmPassword: "",
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-[#f3ece7] text-[#1b130d] font-semibold rounded-lg hover:bg-[#e7d9cf] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#9a6c4c] mb-1">Nome</p>
                    <p className="text-lg font-semibold text-[#1b130d]">
                      {profile.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#9a6c4c] mb-1">Email</p>
                    <p className="text-lg font-semibold text-[#1b130d]">
                      {profile.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#9a6c4c] mb-1">Telefone</p>
                    <p className="text-lg font-semibold text-[#1b130d]">
                      {profile.phone || "Não informado"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#9a6c4c] mb-1">Tipo de Conta</p>
                    <p className="text-lg font-semibold text-[#1b130d]">
                      {profile.role === "ADMIN"
                        ? "Administrador"
                        : "Usuário Regular"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#9a6c4c] mb-1">
                      Autenticação de Dois Fatores
                    </p>
                    <p className="text-lg font-semibold text-[#1b130d]">
                      {profile.is2FAEnabled ? "Ativada" : "Desativada"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#9a6c4c] mb-1">Membro desde</p>
                    <p className="text-lg font-semibold text-[#1b130d]">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            "pt-BR"
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#1b130d]">Segurança</h2>
                {!showChangePassword && (
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#ee7c2b] text-white rounded-lg hover:bg-[#ee7c2b]/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      lock
                    </span>
                    Mudar Senha
                  </button>
                )}
              </div>

              {showChangePassword ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1b130d] mb-2">
                      Senha Atual
                    </label>
                    <div className="relative flex w-full flex-1 items-stretch">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        placeholder="Digite sua senha atual"
                        value={changePasswordData.currentPassword}
                        onChange={(e) =>
                          setChangePasswordData({
                            ...changePasswordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-12 placeholder:text-[#9a6c4c] p-[12px] text-base font-normal leading-normal pr-12"
                      />
                      <button
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#9a6c4c] hover:text-[#1b130d]"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1b130d] mb-2">
                      Nova Senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Digite sua nova senha"
                      value={changePasswordData.newPassword}
                      onChange={(e) =>
                        setChangePasswordData({
                          ...changePasswordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-12 placeholder:text-[#9a6c4c] p-[12px] text-base font-normal leading-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1b130d] mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmNewPassword"
                      placeholder="Confirme sua nova senha"
                      value={changePasswordData.confirmNewPassword}
                      onChange={(e) =>
                        setChangePasswordData({
                          ...changePasswordData,
                          confirmNewPassword: e.target.value,
                        })
                      }
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50 border border-[#e7d9cf] bg-[#fcfaf8] focus:border-[#ee7c2b] h-12 placeholder:text-[#9a6c4c] p-[12px] text-base font-normal leading-normal"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#ee7c2b] text-white font-semibold rounded-lg hover:bg-[#ee7c2b]/90 transition-colors"
                    >
                      Salvar Nova Senha
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        setChangePasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmNewPassword: "",
                        });
                        setErrorMessage("");
                      }}
                      className="flex-1 px-4 py-2 bg-[#f3ece7] text-[#1b130d] font-semibold rounded-lg hover:bg-[#e7d9cf] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-[#9a6c4c]">
                  <p className="mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      lock
                    </span>
                    Você pode alterar sua senha a qualquer momento
                  </p>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-red-700 mb-2">
                Zona de Perigo
              </h2>
              <p className="text-red-600 mb-4">
                Essas ações não podem ser desfeitas.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">delete</span>
                Deletar Conta
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-solid border-[#e7d9cf] px-4 py-8 bg-white">
          <div className="flex w-full justify-center">
            <div className="flex w-full max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1b130d]">UAIFOOD</h3>
                <p className="text-sm text-[#9a6c4c]">
                  © 2025. All Rights Reserved.
                </p>
              </div>
              <div className="flex gap-6 text-sm">
                <a
                  className="text-[#9a6c4c] hover:text-[#ee7c2b] transition-colors"
                  href="#"
                >
                  Sobre Nós
                </a>
                <a
                  className="text-[#9a6c4c] hover:text-[#ee7c2b] transition-colors"
                  href="#"
                >
                  Contato
                </a>
                <a
                  className="text-[#9a6c4c] hover:text-[#ee7c2b] transition-colors"
                  href="#"
                >
                  FAQ
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
