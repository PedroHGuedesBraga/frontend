import { useState } from "react";
import axios from "axios";

export function useUpdateContrato() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateContrato = async (contratoId: string, data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.patch(
        `http://localhost:3000/contrato/${contratoId}`,
        data
      );

      return response.data;
    } catch (err: any) {
      console.error("Erro ao atualizar contrato:", err);
      setError(err.message || "Erro desconhecido ao atualizar contrato");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateContrato, loading, error };
}
