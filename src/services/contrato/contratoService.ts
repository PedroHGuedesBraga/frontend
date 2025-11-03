import api from '@/services/api';
import  {Contrato}  from "@/types/contrato";

export const contratoService = {
  getById: async (id: string): Promise<Contrato> => {
    const res = await api.get<Contrato>(`/contrato/${id}`);
    return res.data;
  },

  getAll: async (): Promise<Contrato[]> => {
    const res = await api.get<Contrato[]>(`/contrato`);
    return res.data;
  },

  create: async (payload: Partial<Contrato>): Promise<Contrato> => {
    const res = await api.post<Contrato>(`/contrato`, payload);
    return res.data;
  },

  update: async (id: string, payload: Partial<Contrato>): Promise<Contrato> => {
    const res = await api.put<Contrato>(`/contrato/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/contrato/${id}`);
  },
  getItensByContrato: async (contratoId: string) => {
  const res = await api.get(`/contrato/${contratoId}/itens`);
  return res.data; // { contrato, itens }
},
};
