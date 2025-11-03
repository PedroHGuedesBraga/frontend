import type { Contrato } from './contrato';

export interface Item {
  id: string;
  nome: string;
  descricao: string;
  quantidadeItem: number;
  precoUnitario: number;
  data: string;
  unidadeDeMedida: string;
  aprovado: boolean;
  contratoId: string;
  contrato?: Contrato;
}
