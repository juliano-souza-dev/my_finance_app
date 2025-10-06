// src/hooks/useRequireAuth.ts

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redireciona APENAS se o estado for FALSE (checou e não está logado)
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Retorna o estado para o componente de página, que decide o que renderizar.
  return isAuthenticated;
}
