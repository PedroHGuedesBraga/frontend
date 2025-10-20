// src/hooks/useSecretariaById.ts (Refatorado)
import { useState, useEffect } from 'react';
import axios from 'axios';

// Definições de Interface
interface Contrato {
  id: string;
  nome: string;
  data: string;
  status: 'ativo' | 'andamento' | 'urgente' | 'aprovado' | 'concluido'; 
  aprovado: boolean;
}

interface Secretaria {
  id: string;
  nome: string;
  contratos: Contrato[];
}

const API_URL = 'http://localhost:3000/secretaria'; 

// Ajustamos o tipo para aceitar string | string[] | undefined (como o Next.js passa)
const useSecretariaById = (secretariaId: string | string[] | undefined) => {
  const [secretaria, setSecretaria] = useState<Secretaria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Garante que o ID seja uma string simples, se for válido
  const id = Array.isArray(secretariaId) ? secretariaId[0] : secretariaId;

  useEffect(() => {
    // Se o ID for undefined (primeiro render do Next.js) ou vazio, apenas espera
    if (!id) {
        setLoading(true); // Mantém o loading true, esperando o ID real
        return;
    }

    const fetchSecretaria = async () => {
      setLoading(true);
      setError(null);
      try {
        // Requisição para a sua API NestJS
        const response = await axios.get<Secretaria>(`${API_URL}/${id}`);
        setSecretaria(response.data);
      } catch (err) {
        console.error(`Erro ao buscar secretaria ${id}:`, err);
        // Exibe uma mensagem de erro útil para o usuário
        if (axios.isAxiosError(err) && err.response?.status === 404) {
            setError(`Secretaria com ID ${id} não encontrada.`);
        } else {
            setError("Erro ao carregar dados. Verifique a API (http://localhost:3000).");
        }
        setSecretaria(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSecretaria();
  }, [id]); // Depende do ID

  return { secretaria, loading, error };
};

export default useSecretariaById;