// src/hooks/useContratos.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/contrato'; 
const SECRETARIA_API_URL = 'http://localhost:3000/secretaria';

// --- Tipos de Dados ---
interface Item {
    id: string;
    // ... outros campos do item
}

interface Secretaria {
    id: string;
    nome: string;
    // ... outros campos da secretaria
}

interface Contrato {
    id: string;
    nome: string;
    data: string;
    status: string; 
    aprovado: boolean;
    secretaria: Secretaria | null;
    itens: Item[] | null; // Array de itens aninhado
    itensQuantidade: number; // Campo que vamos sobrescrever
}

interface HookResult {
    contratosFiltrados: Contrato[];
    secretariaNome: string | null;
    loading: boolean;
    error: string | null;
}

export default function useContratos(secretariaId: string | string[] | undefined, monthNumber: string): HookResult {
    const [contratosFiltrados, setContratosFiltrados] = useState<Contrato[]>([]);
    const [secretariaNome, setSecretariaNome] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Tratamento para Next.js: pega o primeiro item se for array, ou undefined/string
    const id = Array.isArray(secretariaId) ? secretariaId[0] : secretariaId;

    const fetchContratos = useCallback(async () => {
        // Log 1: Início da função
        console.log(`[useContratos START] ID Recebido: ${id}, Mês Recebido: ${monthNumber}`);
        
        if (!id || !monthNumber) {
            console.warn("[useContratos LOG] ID ou Mês ausente ou null. Abortando fetch.");
            setLoading(false); 
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // 1. Busca TODOS os contratos (no front-end, por enquanto)
            const response = await axios.get<Contrato[]>(API_URL);
            const contratosData = response.data;
            
            // Log 2: Sucesso na API
            console.log(`[useContratos LOG] 2. Sucesso na API - Total de contratos brutos: ${contratosData.length}`);

            // 2. FILTRAGEM E CORREÇÃO DA CONTAGEM
            const contratosFinais = contratosData
                .filter(c => {
                    const isSecretaria = c.secretaria?.id === id;
                    // Extrai o mês (MM) da data (YYYY-MM-DD)
                    const contratoMonthString = c.data ? c.data.split('-')[1] : null; 
                    const isMonth = contratoMonthString === monthNumber;
                    return isSecretaria && isMonth;
                })
                .map(c => ({ 
                    ...c,
                    // CORREÇÃO: Calcula a contagem real dos itens aninhados
                    itensQuantidade: c.itens ? c.itens.length : 0, 
                }));

            // Log 4: Filtragem Concluída
            console.log(`[useContratos LOG] 4. Filtragem Concluída. Contratos para exibir: ${contratosFinais.length}`);

            setContratosFiltrados(contratosFinais);

            // 3. Busca o Nome da Secretaria
            if (id) {
                const secretariaResponse = await axios.get(`${SECRETARIA_API_URL}/${id}`);
                setSecretariaNome(secretariaResponse.data.nome);
            }
            
        } catch (err: any) {
            console.error("Erro ao buscar contratos:", err.message || err);
            setError("Erro ao carregar contratos. Verifique se o backend está rodando.");
            setContratosFiltrados([]);
            setSecretariaNome(null);
        } finally {
            setLoading(false);
        }
    }, [id, monthNumber]);

    useEffect(() => {
        if (id && monthNumber) {
            fetchContratos();
        }
    }, [id, monthNumber, fetchContratos]);

    return { contratosFiltrados, secretariaNome, loading, error };
}