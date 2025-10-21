// hooks/POST/useAddItem.ts
import { useState } from "react";
import axios from "axios";

// 🔹 Payload completo seguindo Entity Item
export interface AddItemPayload {
  nome: string;
  descricao: string;
  quantidadeItem: number;
  precoUnitario: number;
  data: string; // YYYY-MM-DD
  unidadeDeMedida: string;
  aprovado: boolean;
  contratoId: string;
}

export default function useAddItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = async (payload: AddItemPayload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `http://localhost:3000/item`,
        payload
      );

      return response.data;
    } catch (err: any) {
      console.error("Erro ao adicionar item:", err);
      setError(err.message || "Erro desconhecido ao adicionar item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addItem, loading, error };
}
