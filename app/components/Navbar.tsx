'use client'

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Home Link */}
        <Link
          href="/"
          className="text-white text-xl font-extrabold hover:text-blue-400 transition duration-200"
        >
          FINANCEIRO
        </Link>

        {/* Links de Navegação */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            // Opções para USUÁRIO LOGADO
            <>
              {/* Link para o formulário de Lançamentos */}
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition duration-200"
              >
                Lançamentos
              </Link>

              <span className="text-gray-400 text-sm hidden sm:inline">
                Olá, {user?.name}!
              </span>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm transition duration-200"
              >
                Sair
              </button>
            </>
          ) : (
            // Opções para USUÁRIO DESLOGADO
            // O link de login é usado para guiar o usuário.
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm transition duration-200"
            >
              Fazer Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
