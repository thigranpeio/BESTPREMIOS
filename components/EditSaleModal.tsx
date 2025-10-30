import React, { useState, FormEvent, useEffect, Fragment } from 'react';
import { Sale } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface EditSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale;
  onUpdateSale: (updatedSale: Sale) => void;
  onDeleteSale: (saleId: string) => void;
}

const EditSaleModal: React.FC<EditSaleModalProps> = ({ isOpen, onClose, sale, onUpdateSale, onDeleteSale }) => {
  const [formData, setFormData] = useState<Sale>(sale);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    setFormData(sale);
  }, [sale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSale(formData);
    onClose();
  };

  const handleDelete = () => {
    onDeleteSale(sale.id);
    setIsConfirmingDelete(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <Fragment>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={isConfirmingDelete ? undefined : onClose}>
        <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Editar Lançamento</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">Data</label>
                <input type="date" name="data" value={formData.data} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300">Loja</label>
                <input type="text" value={formData.loja} disabled className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-400 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">OS Loja</label>
              <input type="text" name="osLoja" value={formData.osLoja} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">OS Savwin</label>
              <input type="text" name="osSavwin" value={formData.osSavwin} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Lente</label>
              <input type="text" name="lente" value={formData.lente} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Tratamento</label>
              <input type="text" name="tratamento" value={formData.tratamento} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-300">Prêmio (R$)</label>
              <input type="number" name="premio" step="0.01" value={formData.premio || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: 150.50"/>
            </div>
            <div className="flex justify-between items-center gap-4 pt-4">
               <button type="button" onClick={() => setIsConfirmingDelete(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-300 font-semibold rounded-lg hover:bg-red-600/40 transition-colors">
                  <TrashIcon className="h-5 w-5"/>
                  Excluir
               </button>
              <div className="flex gap-4">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Salvar Alterações</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[60]" onClick={() => setIsConfirmingDelete(false)}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h3>
                <p className="text-slate-300 mb-6">
                    Você tem certeza que deseja excluir este lançamento? Esta ação é irreversível.
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={() => setIsConfirmingDelete(false)} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                        Sim, Excluir
                    </button>
                </div>
            </div>
        </div>
      )}
    </Fragment>
  );
};

export default EditSaleModal;