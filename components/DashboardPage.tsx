import React, { useState, useMemo, useCallback } from 'react';
import { User, Sale, UserRole, SaleStatus } from '../types';
import { LogoutIcon } from './icons/LogoutIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ExportIcon } from './icons/ExportIcon';
import SalesTable from './SalesTable';
import NewSaleModal from './NewSaleModal';
import EditSaleModal from './EditSaleModal'; 

declare global {
  interface Window {
    jspdf: any;
  }
}

interface DashboardPageProps {
  user: User;
  salesData: Sale[];
  onLogout: () => void;
  onAddSale: (newSale: Omit<Sale, 'id' | 'status'>) => void;
  onDeleteSale: (saleId: string) => void;
  onUpdateSaleStatus: (saleId: string, newStatus: SaleStatus) => void;
  onUpdateSale: (updatedSale: Sale) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, salesData, onLogout, onAddSale, onDeleteSale, onUpdateSaleStatus, onUpdateSale }) => {
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const handleColumnFilterChange = useCallback((column: string, value: string) => {
    setColumnFilters(prev => {
        const newFilters = { ...prev };
        if (value === 'all' || value === '') {
            delete newFilters[column];
        } else {
            newFilters[column] = value;
        }
        return newFilters;
    });
  }, []);

  const filteredSales = useMemo(() => {
    let sales = user.role === UserRole.ADMIN 
      ? salesData 
      : salesData.filter(sale => sale.vendedor_id === user.id);

    if (startDate) {
        sales = sales.filter(sale => new Date(sale.data) >= new Date(startDate + 'T00:00:00'));
    }
    if (endDate) {
        sales = sales.filter(sale => new Date(sale.data) <= new Date(endDate + 'T23:59:59'));
    }
    
    const activeFilters = Object.entries(columnFilters);
    if (activeFilters.length > 0) {
        sales = sales.filter(sale => {
            return activeFilters.every(([key, value]) => {
                return String(sale[key as keyof Sale] ?? '') === value;
            });
        });
    }

    return sales.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [user, salesData, startDate, endDate, columnFilters]);

  const salesSummary = useMemo(() => {
    return filteredSales.reduce((acc, sale) => {
        if (sale.status === SaleStatus.PAGO) {
            acc.pago += 1;
        } else {
            acc.emAberto += 1;
        }
        return acc;
    }, { pago: 0, emAberto: 0 });
  }, [filteredSales]);
  
  const handleExportPdf = () => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();

    const tableColumns = ["Data", "Vendedor", "Loja", "OS Loja", "OS Savwin", "Lente", "Tratamento", "Prêmio", "Status"];
    const tableRows: (string | number)[][] = [];

    filteredSales.forEach(sale => {
      const saleData = [
        new Date(sale.data + 'T00:00:00').toLocaleDateString('pt-BR'),
        sale.vendedor_nome,
        sale.loja,
        sale.os_loja,
        sale.os_savwin,
        sale.lente,
        sale.tratamento,
        sale.premio ? sale.premio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-',
        sale.status,
      ];
      tableRows.push(saleData);
    });

    doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 20,
    });
    
    doc.text("Relatório de Vendas", 14, 15);
    doc.save("relatorio_vendas.pdf");
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
  };
  
  const handleCloseEditModal = () => {
    setEditingSale(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">
              BEST<span className="text-indigo-400">PRÊMIOS</span>
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                  <span className="text-white font-semibold">{user.nome}</span>
                  <span className="block text-xs text-indigo-300">{user.role}</span>
              </div>
              <button onClick={onLogout} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                <LogoutIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {user.role === UserRole.ADMIN ? 'Todos os Lançamentos' : 'Meus Lançamentos'}
          </h2>
          <div className="flex items-center gap-2">
             <button
              onClick={handleExportPdf}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-all duration-200"
            >
              <ExportIcon className="h-5 w-5" />
              Exportar PDF
            </button>
            <button
              onClick={() => setIsNewSaleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Lançamento
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-slate-800 rounded-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
                <label htmlFor="startDate" className="text-sm font-medium text-slate-300">De:</label>
                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="endDate" className="text-sm font-medium text-slate-300">Até:</label>
                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div className="flex-grow border-t border-slate-700 sm:border-t-0 sm:border-l sm:pl-6 sm:ml-6 mt-4 sm:mt-0 pt-4 sm:pt-0">
                <div className="flex gap-6 text-sm">
                    <p><span className="font-bold text-yellow-300">Em Aberto:</span> {salesSummary.emAberto}</p>
                    <p><span className="font-bold text-green-300">Pago:</span> {salesSummary.pago}</p>
                </div>
            </div>
        </div>

        <SalesTable 
            sales={filteredSales} 
            currentUser={user}
            filters={columnFilters}
            onEditSale={handleEditSale}
            onUpdateSaleStatus={onUpdateSaleStatus}
            onColumnFilterChange={handleColumnFilterChange}
        />
      </main>

      <NewSaleModal
        isOpen={isNewSaleModalOpen}
        onClose={() => setIsNewSaleModalOpen(false)}
        onAddSale={onAddSale}
        currentUser={user}
      />
      
      {editingSale && (
        <EditSaleModal
            isOpen={!!editingSale}
            onClose={handleCloseEditModal}
            sale={editingSale}
            onUpdateSale={onUpdateSale}
            onDeleteSale={onDeleteSale}
        />
      )}
    </div>
  );
};

export default DashboardPage;