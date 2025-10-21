import axios from 'axios';

const API_URL = 'http://localhost:3000/contrato';

export const useAddContrato = () => {
  const addContrato = async (data: {
    nome: string;
    data: string;
    status: string;
    aprovado: boolean;
    itensQuantidade: number;
    secretariaId: string;
  }) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar contrato:", error);
      throw error;
    }
  };

  return { addContrato };
};
