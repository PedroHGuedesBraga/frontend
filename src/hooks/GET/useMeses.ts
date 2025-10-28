// src/hooks/GET/useMeses.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// MUDANÇA IMPORTANTE: Altere o API_URL base para buscar a Secretaria!
const API_URL_BASE = 'http://localhost:3000/secretaria';

// --- ESTRUTURA DOS MESES (Nome e Número de 01 a 12) ---
const MONTH_DATA = [
  { name: "Janeiro", number: "01" },
  { name: "Fevereiro", number: "02" },
  { name: "Março", number: "03" },
  { name: "Abril", number: "04" },
  { name: "Maio", number: "05" },
  { name: "Junho", number: "06" },
  { name: "Julho", number: "07" },
  { name: "Agosto", number: "08" },
  { name: "Setembro", number: "09" },
  { name: "Outubro", number: "10" },
  { name: "Novembro", number: "11" },
  { name: "Dezembro", number: "12" },
];

// Tipos baseados na resposta da API: /secretaria/:id
interface Contrato {
  id: string;
  nome: string; // Changed from 'data' to match the API response
  data: string; // "2025-01-27"
  status: "aprovado" | "andamento" | "urgente" | string;
  aprovado: boolean;
  itensQuantidade: number;
  itens: any[];
}

interface SecretariaResponse {
  id: string;
  nome: string;
  contratos: Contrato[];
}

export interface MesesData {
  monthName: string;
  monthNumber: string;
  totalCount: number;
  aprovadoCount: number;
  andamentoCount: number;
  urgenteCount: number;
}

interface HookResult {
  meses: MesesData[];
  secretariaNome: string | null;
  contratos: Contrato[]; // Added contratos to return value
  loading: boolean;
  error: string | null;
}

export default function useMeses(secretariaId: string | string[] | undefined): HookResult {
  const [meses, setMeses] = useState<MesesData[]>([]);
  const [secretariaNome, setSecretariaNome] = useState<string | null>(null);
  const [contratos, setContratos] = useState<Contrato[]>([]); // Added contratos state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = Array.isArray(secretariaId) ? secretariaId[0] : secretariaId;

  const fetchMesesData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Busca a SECRETARIA e seus CONTRATOS ANINHADOS
      const response = await axios.get<SecretariaResponse>(`${API_URL_BASE}/${id}`);
      const secretariaData = response.data;

      // 2. Extrai a lista de contratos
      const contratosDaSecretaria = secretariaData.contratos || [];

      // 3. Atualiza o nome e contratos
      setSecretariaNome(secretariaData.nome);
      setContratos(contratosDaSecretaria);

      // 4. Calcula a contagem por mês
      const contratosByMonth = MONTH_DATA.map((month) => {
        const contratosDoMes = contratosDaSecretaria.filter((c) => {
          if (!c.data) return false;
          // Se o TypeORM salvar como string "YYYY-MM-DD", esta lógica funciona:
          const contratoMonthString = c.data.split('-')[1];
          return contratoMonthString === month.number;
        });

        return {
          monthName: month.name,
          monthNumber: month.number,
          totalCount: contratosDoMes.length,
          aprovadoCount: contratosDoMes.filter((c) => c.status === "aprovado").length,
          andamentoCount: contratosDoMes.filter((c) => c.status === "andamento").length,
          urgenteCount: contratosDoMes.filter((c) => c.status === "urgente").length,
        };
      });

      setMeses(contratosByMonth);
    } catch (err) {
      console.error(`Erro ao buscar dados de meses:`, err);
      // Verifica se é um erro 404
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError(`Secretaria com ID ${id} não encontrada.`);
      } else {
        setError("Erro ao carregar dados dos meses. Verifique a API (porta 3000).");
      }
      setMeses([]);
      setSecretariaNome(null);
      setContratos([]); // Clear contratos on error
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchMesesData();
    }
  }, [id, fetchMesesData]);

  return { meses, secretariaNome, contratos, loading, error };
}