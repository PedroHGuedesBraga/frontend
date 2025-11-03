import api from './api';

interface LoginResponse {
  token: string;
  user?: any;
  admin?: any;
}

export const authService = {
  loginAdmin: async (cpf: string, senha: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/admin/login', { cpf, senha });
    localStorage.setItem('token', data.token);
    return data;
  },

  loginUsuario: async (cpf: string, senha: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/usuario/login', { cpf, senha });
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};
