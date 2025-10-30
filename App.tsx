import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { User, Sale, UserRole, SaleStatus } from './types';
import { MOCK_USERS, MOCK_SALES } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleAddSale = useCallback((newSale: Omit<Sale, 'id' | 'status'>) => {
    setSales(prevSales => [
        { 
          ...newSale, 
          id: `sale-${Date.now()}`,
          status: SaleStatus.EM_ABERTO
        },
        ...prevSales
    ]);
  }, []);
  
  const handleDeleteSale = useCallback((saleId: string) => {
    setSales(prevSales => prevSales.filter(sale => sale.id !== saleId));
  }, []);

  const handleUpdateSaleStatus = useCallback((saleId: string, newStatus: SaleStatus) => {
    setSales(prevSales => 
        prevSales.map(sale => 
            sale.id === saleId ? { ...sale, status: newStatus } : sale
        )
    );
  }, []);

  const handleUpdateSale = useCallback((updatedSale: Sale) => {
    setSales(prevSales => 
        prevSales.map(sale => 
            sale.id === updatedSale.id ? updatedSale : sale
        )
    );
  }, []);

  const handleRegister = useCallback((newUser: Omit<User, 'id' | 'role'>) => {
      const user: User = {
          ...newUser,
          id: `user-${Date.now()}`,
          role: UserRole.USER,
      };
      MOCK_USERS.push(user);
      setCurrentUser(user);
  }, []);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
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