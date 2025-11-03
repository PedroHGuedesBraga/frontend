import { useState, useEffect } from "react";
import { contratoService } from "@/services/contrato/contratoService";
import { Contrato } from "@/types/contrato";
import { Item} from "@/types/item";
 
export default function useItensContrato(contratoId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [itens, setItens] = useState<Item[]>([]);

  const fetchItens = async () => {
    try {
      setLoading(true);
      const res = await contratoService.getItensByContrato(contratoId);
      setContrato(res.contrato);
      setItens(res.itens);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao buscar itens do contrato");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItens();
  }, [contratoId]);

  return { contrato, itens, loading, error, fetchItens };
}
