"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


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
  const { login, isAuthenticated } = useAuth(); 
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });


  if (isAuthenticated) {
    router.push("/");
    return null; 
  }

  const onSubmit = async (data: LoginFormData) => {
   

    await new Promise((resolve) => setTimeout(resolve, 1000));

    login(data.username);

    router.push("/");
  };

  return (
    <div >
      <div >
        <h2>
          Acesso ao Sistema
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo Username */}
          <div>
            <label
              htmlFor="username"
              className=""
            >
              Usuário:
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
            />
            {errors.username && (
              <p >
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
