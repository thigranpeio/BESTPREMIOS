export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum SaleStatus {
  EM_ABERTO = 'Em aberto',
  PAGO = 'Pago',
}

export interface User {
  id: string;
  cpf: string;
  nome: string;
  loja: string;
  cidade: string;
  role: UserRole;
  password_mock: string;
}

export interface Sale {
  id:string;
  data: string;
  vendedorId: string;
  vendedorNome: string;
  loja: string;
  osLoja: string;
  osSavwin: string;
  lente: string;
  tratamento: string;
  status: SaleStatus;
  premio?: number;
}