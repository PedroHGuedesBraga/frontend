// src/hooks/useItens.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// O endpoint agora é específico para um contrato
const BASE_API_URL = 'http://localhost:3000/contrato';

// Tipos baseados na sua estrutura de contrato e item
export interface Item { 
    id: string;
    nome: string;
    descricao: string;
    quantidadeItem: number;
    precoUnitario: number;
    data: string;
    unidadeDeMedida: string;
    aprovado: boolean;
}

export interface ContratoComItens { 
    id: string;
    nome: string;
    data: string;
    status: string; 
    aprovado: boolean;
    itensQuantidade: number; 
    itens: Item[]; // O array de itens aninhado
    secretaria: { id: string, nome: string }; // Importante para o CSV
}

interface HookResult {
    contrato: ContratoComItens | null;
    itens: Item[];
    loading: boolean;
    error: string | null;
}

// 💡 CORREÇÃO AQUI: Adiciona o `refreshKey` como segundo argumento OPCIONAL.
export default function useItens(
    contratoId: string | string[] | undefined,
    refreshKey: number = 0 // <--- Novo argumento opcional com valor padrão
): HookResult {
    const [contrato, setContrato] = useState<ContratoComItens | null>(null);
    const [itens, setItens] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Converte contratoId para o ID único (se necessário)
    const id = Array.isArray(contratoId) ? contratoId[0] : contratoId;

    // Usa `id` e `refreshKey` como dependências para recriar a função de busca
    const fetchItensData = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const API_URL = `${BASE_API_URL}/${id}`;
            const response = await axios.get<ContratoComItens>(API_URL);
            const contratoData = response.data;

            setContrato(contratoData);
            setItens(contratoData.itens || []);

        } catch (err: any) {
            console.error(`Erro ao buscar itens do contrato ${id}:`, err.message || err);
            setError("Erro ao carregar detalhes do contrato e itens.");
            setItens([]);
            setContrato(null);
        } finally {
            setLoading(false);
        }
        // 💡 Adicionando refreshKey como dependência. Quando o valor muda, o useCallback cria uma nova função.
    }, [id, refreshKey]);

    useEffect(() => {
        if (id) {
            fetchItensData();
        }
        // 💡 A única dependência aqui agora é o fetchItensData
    }, [fetchItensData]);

    return { contrato, itens, loading, error };
}