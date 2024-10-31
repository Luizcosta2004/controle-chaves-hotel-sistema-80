export type TipoMovimentacao = "chave_entregue" | "chave_devolvida" | "hospede_checkin" | "hospede_checkout";

export interface Historico {
  id: string;
  data: string;
  tipo: TipoMovimentacao;
  descricao: string;
  quarto?: string;
  hospede?: string;
}