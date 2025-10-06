// src/pages/login.tsx (CORRIGIDO)

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext"; // Hook de autenticação
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// --- 1. Definição do Schema Zod para o Login ---
// ✅ MOVIDO: A chamada do useAuth DEVE estar dentro do componente!
const LoginSchema = z.object({
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type LoginFormData = z.infer<typeof LoginSchema>;

/**
 * @function LoginPage
 * @description Componente da página de login.
 */
function LoginPage() {
  // ✅ 1. CHAME TODOS OS HOOKS NO TOPO DA FUNÇÃO!
  const { login, isAuthenticated } = useAuth(); // CORRIGIDO: Agora dentro do componente
  const router = useRouter();

  const {
    // CORRIGIDO: useForm não é mais chamado condicionalmente
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  // Se o usuário JÁ estiver logado, redireciona para a página inicial (/)
  // A lógica condicional DEVE vir APÓS a chamada dos Hooks.
  if (isAuthenticated) {
    router.push("/");
    return null; // Não renderiza nada enquanto redireciona
  }

  // --- 2. Lógica de Submissão do Formulário ---
  const onSubmit = async (data: LoginFormData) => {
    // ⚠️ Em um projeto real, aqui você chamaria sua API de autenticação.
    // Ex: const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) });

    console.log("Tentativa de Login com:", data.username);

    // SIMULAÇÃO DE SUCESSO DE LOGIN:
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Chama a função login() do contexto com o nome do usuário.
    login(data.username);

    // Garante o redirecionamento.
    router.push("/");
  };

  // --- 3. Renderização do Formulário com Tailwind ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Acesso ao Sistema
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Usuário:
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Campo Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha:
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-lg text-white font-semibold transition duration-200 ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            }`}
          >
            {isSubmitting ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
