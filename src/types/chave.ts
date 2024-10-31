export type StatusChave = "disponível" | "em uso" | "manutenção";

export interface Chave {
  id: string;
  numero: string;
  andar: string;
  tipo: string;
  status: StatusChave;
  observacao?: string;
}