// lib/api.ts

/**
 * Função wrapper para Fetch que lida com a checagem de erros HTTP e parsing JSON.
 */
export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  
  const response = await fetch(url, options);

  // 1. Tratamento de Erro Robusto
  if (!response.ok) {
    let errorDetail = 'Erro desconhecido';
    try {
      // Tenta ler o corpo da resposta para mais detalhes
      const errorData = await response.json();
      errorDetail = errorData.message || JSON.stringify(errorData);
    } catch {
      // Se não conseguir ler o JSON, usa o status
      errorDetail = `Erro HTTP: ${response.status} ${response.statusText}`;
    }
    
    // Lança um erro para ser pego no bloco catch do componente
    throw new Error(errorDetail); 
  }

  // 2. Parsing JSON Automático (Como o Axios faz)
  return response.json() as Promise<T>;
}

// Exemplo de uso no seu EntryForm:
// const categories = await fetchJson<string[]>('/api/categories');