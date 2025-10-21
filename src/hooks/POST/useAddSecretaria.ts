import axios from 'axios';

const API_URL = 'http://localhost:3000/secretaria';

export const useAddSecretaria = () => {
  const addSecretaria = async (nome: string) => {
    try {
      const response = await axios.post(API_URL, { nome });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar secretaria:", error);
      throw error;
    }
  };

  return { addSecretaria };
};
