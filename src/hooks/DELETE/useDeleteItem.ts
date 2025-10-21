// src/hooks/DELETE/useDeleteItem.ts
import { useState } from 'react';
import axios from 'axios';

export function useDeleteItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `http://localhost:3000/item/${itemId}` // Endpoint corrigido
      );
      
      setLoading(false);
      return response.data; // Retorna o sucesso

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro desconhecido ao deletar item.";
      console.error("Erro ao deletar item:", err);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return { deleteItem, loading, error };
}