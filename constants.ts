
import { User, Sale, UserRole } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    cpf: '12345678900',
    nome: 'OURILENTES',
    loja: 'Matriz',
    cidade: 'OURINHOS',
    role: UserRole.ADMIN,
    password_mock: 'Bestview',
  }
];

export const MOCK_SALES: Sale[] = [
  
];