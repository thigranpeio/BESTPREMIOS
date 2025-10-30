import React, { useState, FormEvent } from 'react';
import { User } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (newUser: Omit<User, 'id' | 'role'>) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ users, onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loja, setLoja] = useState('');
  const [cidade, setCidade] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.cpf === cpf && u.password_mock === password);
    if (user) {
      onLogin(user);
    } else {
      setError('CPF ou senha inválidos.');
    }
  };
  
  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if(!nome || !cpf || !loja || !cidade || !password){
        setError('Todos os campos são obrigatórios.');
        return;
    }
    const existingUser = users.find(u => u.cpf === cpf);
    if (existingUser) {
        setError('Este CPF já está cadastrado.');
        return;
    }
    
    onRegister({ nome, cpf, loja, cidade, password_mock: password });
  };
  
  const formToShow = () => {
      if(isRegistering) {
          return (
             <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-white">Criar Conta</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-300">Nome Completo</label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">CPF</label>
                  <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-300">Loja</label>
                  <input type="text" value={loja} onChange={e => setLoja(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-300">Cidade</label>
                  <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-300">Senha</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors">Cadastrar</button>
                <p className="text-center text-sm text-slate-400">
                  Já tem uma conta? <button type="button" onClick={() => setIsRegistering(false)} className="font-medium text-indigo-400 hover:text-indigo-300">Entrar</button>
                </p>
            </form>
          );
      }
      return (
        <form onSubmit={handleLoginSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">Bem-vindo de Volta</h2>
            <div>
              <label className="block text-sm font-medium text-slate-300">CPF</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} required className="block w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Senha</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <LockIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors">Entrar</button>
            <p className="text-center text-sm text-slate-400">
                Não tem uma conta? <button type="button" onClick={() => setIsRegistering(true)} className="font-medium text-indigo-400 hover:text-indigo-300">Cadastre-se</button>
            </p>
        </form>
      )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-8">
        <EyeIcon className="h-10 w-10 text-indigo-400" />
        <h1 className="ml-3 text-4xl font-extrabold text-white tracking-tight">BEST PRÊMIOS</h1>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl shadow-slate-950/50">
        {formToShow()}
      </div>
    </div>
  );
};

export default LoginPage;