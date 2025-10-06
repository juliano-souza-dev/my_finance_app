// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Chave para persistência no localStorage
const AUTH_TOKEN_KEY = "app_auth_token";

interface User {
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean | undefined; // 'undefined' durante a checagem inicial
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | null>(null);

  // --- CARREGAMENTO INICIAL: Checa o localStorage ---
  useEffect(() => {
    // Roda apenas no lado do cliente
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (token) {
        // Sessão válida encontrada. Em uma app real, você VALIDARIA o token.
        setIsAuthenticated(true);
        setUser({ name: token });
      } else {
        // Nenhuma sessão encontrada.
        setIsAuthenticated(false);
      }
    }
  }, []);

  // --- Funções de Login e Logout ---
  const login = (name: string) => {
    // Simula o token (usando o nome).
    const token = name;

    setIsAuthenticated(true);
    setUser({ name });
    localStorage.setItem(AUTH_TOKEN_KEY, token); // Persiste
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY); // Remove a persistência
  };

  const value = { isAuthenticated, user, login, logout };

  // ⚠️ Bloqueia a renderização de tudo até saber se está logado ou não
  if (isAuthenticated === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">
          Carregando Sessão...
        </p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para consumir o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
