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
  vendedor_id: string;
  vendedor_nome: string;
  loja: string;
  os_loja: string;
  os_savwin: string;
  lente: string;
  tratamento: string;
  status: SaleStatus;
  premio?: number;
}