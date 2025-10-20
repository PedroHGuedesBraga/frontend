// src/hooks/useMeses.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/contrato'; 

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

// Tipos baseados no seu JSON
interface SecretariaInfo {
    id: string;
    nome: string;
}
interface Contrato {
    id: string;
    data: string;
    secretaria: SecretariaInfo;
    // ... outros campos (status, aprovado, itensQuantidade)
}
export interface MesesData {
    monthName: string;
    monthNumber: string;
    totalCount: number;
}
interface HookResult {
    meses: MesesData[];
    secretariaNome: string | null;
    loading: boolean;
    error: string | null;
}

export default function useMeses(secretariaId: string | string[] | undefined): HookResult {
    const [meses, setMeses] = useState<MesesData[]>([]);
    const [secretariaNome, setSecretariaNome] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const id = Array.isArray(secretariaId) ? secretariaId[0] : secretariaId;

    const fetchMesesData = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            // 1. Busca TODOS os contratos
            const response = await axios.get<Contrato[]>(API_URL);
            const contratosData = response.data;
            
            // 2. Filtra pela Secretaria ID (em memória)
            const contratosDaSecretaria = contratosData.filter(c => c.secretaria.id === id);

            // 3. Calcula a contagem por mês (Lógica do Hook useMeses)
            const contratosByMonth = MONTH_DATA.map((month) => {
                const contratosDoMes = contratosDaSecretaria.filter(c => { 
                    if (!c.data) return false;
                    try {
                        const contratoMonthString = c.data.split('-')[1]; 
                        return contratoMonthString === month.number;
                    } catch (e) {
                        return false;
                    }
                });

                return {
                    monthName: month.name,
                    monthNumber: month.number,
                    totalCount: contratosDoMes.length
                };
            });

            setMeses(contratosByMonth);
            
            // 4. Obtém o nome da secretaria
            const nomeEncontrado = contratosDaSecretaria[0]?.secretaria.nome || 
                                   contratosData.find(c => c.secretaria.id === id)?.secretaria.nome;
                                   
            setSecretariaNome(nomeEncontrado || `Secretaria (ID: ${id})`);
            
        } catch (err) {
            console.error(`Erro ao buscar dados de meses:`, err);
            setError("Erro ao carregar dados dos meses. Verifique a API (porta 3000).");
            setMeses([]);
            setSecretariaNome(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchMesesData();
        }
    }, [id, fetchMesesData]);

    return { meses, secretariaNome, loading, error };
}