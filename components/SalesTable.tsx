import React, { useState, useEffect, useRef } from 'react';
import { Sale, User, UserRole, SaleStatus } from '../types';
import { EditIcon } from './icons/EditIcon';
import { FilterIcon } from './icons/FilterIcon';

type FilterableColumn = 'vendedor_nome' | 'loja' | 'lente' | 'tratamento' | 'status';

interface SalesTableProps {
  sales: Sale[];
  currentUser: User;
  filters: Record<string, string>;
  onEditSale: (sale: Sale) => void;
  onUpdateSaleStatus: (saleId: string, newStatus: SaleStatus) => void;
  onColumnFilterChange: (column: FilterableColumn, value: string) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ sales, currentUser, filters, onEditSale, onUpdateSaleStatus, onColumnFilterChange }) => {
  const [openFilter, setOpenFilter] = useState<FilterableColumn | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  if (sales.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-lg">
        <h3 className="text-xl font-semibold text-white">Nenhum lançamento encontrado.</h3>
        <p className="text-slate-400 mt-2">Ajuste os filtros ou clique em "Novo Lançamento" para adicionar uma venda.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    const localDate = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR').format(localDate);
  }

  const handleStatusToggle = (sale: Sale) => {
    const newStatus = sale.status === SaleStatus.PAGO ? SaleStatus.EM_ABERTO : SaleStatus.PAGO;
    onUpdateSaleStatus(sale.id, newStatus);
  }

  const renderFilterableHeader = (title: string, columnKey: FilterableColumn) => {
    const uniqueValues = Array.from(new Set(sales.map(s => s[columnKey]))).sort();
    const isActive = !!filters[columnKey];

    return (
        <th scope="col" className="px-6 py-3 relative">
            <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpenFilter(openFilter === columnKey ? null : columnKey)}
            >
                {title}
                {isActive && <FilterIcon className="h-3 w-3 text-indigo-400" />}
            </div>
            {openFilter === columnKey && (
                <div ref={filterRef} className="absolute top-full mt-2 left-0 bg-slate-700 shadow-lg rounded-md p-2 z-20 max-h-60 overflow-y-auto">
                    <button 
                        onClick={() => { onColumnFilterChange(columnKey, 'all'); setOpenFilter(null); }}
                        className="block w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-slate-600"
                    >
                        Todos
                    </button>
                    {uniqueValues.map(value => (
                        <button 
                            key={value}
                            onClick={() => { onColumnFilterChange(columnKey, value); setOpenFilter(null); }}
                            className={`block w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-slate-600 ${filters[columnKey] === value ? 'bg-indigo-600' : ''}`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            )}
        </th>
    )
  }

  return (
    <div className="bg-slate-800 shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-200 uppercase bg-slate-700/50 select-none">
            <tr>
              <th scope="col" className="px-6 py-3">Data</th>
              {renderFilterableHeader("Vendedor", "vendedor_nome")}
              {renderFilterableHeader("Loja", "loja")}
              <th scope="col" className="px-6 py-3">OS Loja</th>
              <th scope="col" className="px-6 py-3">OS Savwin</th>
              {renderFilterableHeader("Lente", "lente")}
              {renderFilterableHeader("Tratamento", "tratamento")}
              <th scope="col" className="px-6 py-3">Prêmio</th>
              {renderFilterableHeader("Status", "status")}
              {currentUser.role === UserRole.ADMIN && (
                <th scope="col" className="px-6 py-3 text-center">Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4">{formatDate(sale.data)}</td>
                <td className="px-6 py-4 font-medium text-white">{sale.vendedor_nome}</td>
                <td className="px-6 py-4">{sale.loja}</td>
                <td className="px-6 py-4">{sale.os_loja}</td>
                <td className="px-6 py-4">{sale.os_savwin}</td>
                <td className="px-6 py-4">{sale.lente}</td>
                <td className="px-6 py-4">{sale.tratamento}</td>
                <td className="px-6 py-4 font-medium text-cyan-300">
                  {sale.premio ? sale.premio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                </td>
                <td className="px-6 py-4">
                   <button 
                    onClick={() => currentUser.role === UserRole.ADMIN && handleStatusToggle(sale)}
                    disabled={currentUser.role !== UserRole.ADMIN}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        sale.status === SaleStatus.PAGO
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    } ${currentUser.role === UserRole.ADMIN ? 'cursor-pointer hover:bg-opacity-40' : 'cursor-default'}`}
                  >
                      {sale.status}
                  </button>
                </td>
                 {currentUser.role === UserRole.ADMIN && (
                    <td className="px-6 py-4 text-center">
                        <button onClick={() => onEditSale(sale)} className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 rounded-full hover:bg-indigo-500/20" aria-label="Editar lançamento">
                            <EditIcon className="h-5 w-5" />
                        </button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;