import React, { useState, FormEvent, Fragment } from 'react';
import { Sale, User } from '../types';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSale: (newSale: Omit<Sale, 'id' | 'status'>) => void;
  currentUser: User;
}

const NewSaleModal: React.FC<NewSaleModalProps> = ({ isOpen, onClose, onAddSale, currentUser }) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    os_loja: '',
    os_savwin: '',
    lente: '',
    tratamento: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddSale({
      ...formData,
      vendedor_id: currentUser.id,
      vendedor_nome: currentUser.nome,
      loja: currentUser.loja,
    });
    // Reset form for next entry
    setFormData({
        data: new Date().toISOString().split('T')[0],
        os_loja: '',
        os_savwin: '',
        lente: '',
        tratamento: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 transform transition-all duration-300 scale-95" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Novo Lançamento de Venda</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Data</label>
            <input type="date" name="data" value={formData.data} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">OS Loja</label>
            <input type="text" name="os_loja" value={formData.os_loja} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">OS Savwin</label>
            <input type="text" name="os_savwin" value={formData.os_savwin} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Lente</label>
            <input type="text" name="lente" value={formData.lente} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Tratamento</label>
            <input type="text" name="tratamento" value={formData.tratamento} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Salvar Lançamento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSaleModal;