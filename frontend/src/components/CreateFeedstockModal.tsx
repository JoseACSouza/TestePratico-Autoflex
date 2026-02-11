import React, { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { useAppDispatch } from '../app/hooks';
import { createFeedstock, fetchFeedstocks } from '../features/inventorySlice';
import type { CreateFeedstockDTO } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFeedstockModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados do Formulário
  const [name, setName] = useState('');
  const [feedstockCode, setFeedstockCode] = useState('');
  const [stock, setStock] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('KG');

  const handleClose = () => {
    setName('');
    setFeedstockCode('');
    setStock('');
    setUnitOfMeasure('KG');
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CreateFeedstockDTO = {
      name,
      feedstockCode,
      stock: Number(stock),
      unitOfMeasure
    };

    try {
      await dispatch(createFeedstock(payload)).unwrap();
      dispatch(fetchFeedstocks({ page: 0, size: 10 }));
      handleClose();
    } catch (error) {
      alert("Erro ao cadastrar matéria-prima. Verifique se o código já existe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-stone-100">
          <h2 className="text-2xl font-serif text-stone-800">Nova Matéria-Prima</h2>
          <button onClick={handleClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1 tracking-wider">Nome do Material</label>
            <input 
              required 
              type="text"
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full border-stone-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-stone-700" 
              placeholder="Ex: Carvalho Americano" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1 tracking-wider">Código (SKU)</label>
              <input 
                required 
                type="text"
                value={feedstockCode} 
                onChange={e => setFeedstockCode(e.target.value)}
                className="w-full border-stone-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-stone-700" 
                placeholder="F-001" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1 tracking-wider">Unidade de Medida</label>
              <select 
                value={unitOfMeasure}
                onChange={e => setUnitOfMeasure(e.target.value)}
                className="w-full border-stone-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-stone-700 bg-stone-50"
              >
                <option value="KG">Quilograma (KG)</option>
                <option value="M">Metro (M)</option>
                <option value="M2">Metro Quadrado (M²)</option>
                <option value="M3">Metro Cúbico (M³)</option>
                <option value="UN">Unidade (UN)</option>
                <option value="L">Litro (L)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1 tracking-wider">Estoque Inicial</label>
            <input 
              required 
              type="number" 
              step="0.0001"
              value={stock} 
              onChange={e => setStock(e.target.value)}
              className="w-full border-stone-200 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-stone-700" 
              placeholder="0.0000" 
            />
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button" 
              onClick={handleClose} 
              className="flex-1 px-6 py-3 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-amber-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-stone-400 font-medium"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18}/> Salvar Material</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}