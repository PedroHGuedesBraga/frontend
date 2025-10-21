// src/hooks/PATCH/useUpdateItem.ts
import { useState } from 'react';
import axios from 'axios';

// Ajuste os tipos conforme a estrutura real do seu payload de atualização
type ItemUpdatePayload = {
  nome?: string;
  descricao?: string;
  quantidadeItem?: number;
  precoUnitario?: number;
  data?: string; // YYYY-MM-DD
  unidadeDeMedida?: string;
  aprovado?: boolean; // Para o patch de aprovação
};

export function useUpdateItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateItem = async (itemId: string, payload: ItemUpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `http://localhost:3000/item/${itemId}`, // Endpoint corrigido
        payload
      );

      setLoading(false);
      return response.data;

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro desconhecido ao atualizar item.";
      console.error("Erro ao atualizar item:", err);
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return { updateItem, loading, error };
}