export type StatusHospede = "ativo" | "inativo" | "checkout";

export interface Hospede {
  id: string;
  nome: string;
  documento: string;
  telefone: string;
  email: string;
  quarto: string;
  status: StatusHospede;
  observacao?: string;
  dataEntrada: string;
  dataSaida: string;
}