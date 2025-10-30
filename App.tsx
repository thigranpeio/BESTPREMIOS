import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { User, Sale, UserRole, SaleStatus } from './types';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
// A URL foi preenchida a partir do link do seu painel.
const SUPABASE_URL = 'https://zpzkvijvluygaimwktca.supabase.co';

// Chave pública (anon key) do Supabase.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwemt2aWp2bHV5Z2FpbXdrdGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzA0MjIsImV4cCI6MjA3NzQwNjQyMn0.uxJYdnOIoPAnkGbXFlH6eTnhioPv0rcBBgIWzY8VI5A';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: usersData, error: usersError } = await supabase.from('users').select('*');
      if (usersError) throw usersError;
      setUsers(usersData || []);

      const { data: salesData, error: salesError } = await supabase.from('sales').select('*');
      if (salesError) throw salesError;
      setSales(salesData || []);

    } catch (err: any) {
      setError(`Erro ao carregar dados: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddSale = async (newSaleData: Omit<Sale, 'id' | 'status'>) => {
    const saleToAdd = {
      ...newSaleData,
      status: SaleStatus.EM_ABERTO
    };

    const { data, error } = await supabase
      .from('sales')
      .insert([saleToAdd])
      .select()
      .single();

    if (error) {
      alert(`Erro ao adicionar venda: ${error.message}`);
    } else {
      setSales(prev => [data, ...prev].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()));
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    const { error } = await supabase.from('sales').delete().eq('id', saleId);
    if (error) {
      alert(`Erro ao excluir venda: ${error.message}`);
    } else {
      setSales(prev => prev.filter(s => s.id !== saleId));
    }
  };

  const handleUpdateSaleStatus = async (saleId: string, newStatus: SaleStatus) => {
    const { data, error } = await supabase
      .from('sales')
      .update({ status: newStatus })
      .eq('id', saleId)
      .select()
      .single();

    if (error) {
      alert(`Erro ao atualizar status: ${error.message}`);
    } else {
      setSales(prev => prev.map(s => (s.id === saleId ? data : s)));
    }
  };

  const handleUpdateSale = async (updatedSale: Sale) => {
    const { id, ...saleToUpdate } = updatedSale;
    const { data, error } = await supabase
      .from('sales')
      .update(saleToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      alert(`Erro ao atualizar venda: ${error.message}`);
    } else {
      setSales(prev => prev.map(s => (s.id === updatedSale.id ? data : s)));
    }
  };

  const handleRegister = async (newUser: Omit<User, 'id' | 'role'>) => {
    const userToRegister = {
      ...newUser,
      role: UserRole.USER,
    };
    const { data, error } = await supabase
        .from('users')
        .insert([userToRegister])
        .select()
        .single();
    
    if (error) {
        alert(`Erro no registro: ${error.message}`);
    } else {
        setUsers(prev => [...prev, data]);
        setCurrentUser(data);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <p className="text-xl">Carregando dados...</p>
        </div>
    );
  }
  
  if(error) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
            <h2 className="text-2xl text-red-400 mb-4">Ocorreu um Erro</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <button 
              onClick={fetchAllData}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tentar Novamente
            </button>
        </div>
      )
  }

  if (!currentUser) {
    return <LoginPage users={users} onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <DashboardPage
      user={currentUser}
      salesData={sales}
      onLogout={handleLogout}
      onAddSale={handleAddSale}
      onDeleteSale={handleDeleteSale}
      onUpdateSaleStatus={handleUpdateSaleStatus}
      onUpdateSale={handleUpdateSale}
    />
  );
};

export default App;