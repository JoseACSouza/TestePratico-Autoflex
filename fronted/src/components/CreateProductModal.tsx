import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFeedstocks, createProduct, fetchProducts } from '../features/inventorySlice';
import type { CreateProductDTO } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedFeedstock {
  feedstockId: number;
  quantity: number;
}

export default function CreateProductModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { feedstocks } = useAppSelector((state) => state.inventory);

  const [name, setName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [selectedFeedstocks, setSelectedFeedstocks] = useState<SelectedFeedstock[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchFeedstocks({ page: 0, size: 100 }));
    }
  }, [isOpen, dispatch]);

  const handleAddFeedstock = () => {
    setSelectedFeedstocks([...selectedFeedstocks, { feedstockId: 0, quantity: 0 }]);
  };

  const handleRemoveFeedstock = (index: number) => {
    setSelectedFeedstocks(selectedFeedstocks.filter((_, i) => i !== index));
  };

  const handleUpdateFeedstock = (index: number, field: keyof SelectedFeedstock, value: number) => {
    const updated = [...selectedFeedstocks];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedFeedstocks(updated);
  };

  const handleClose = () => {
    setName('');
    setProductCode('');
    setUnitPrice('');
    setSelectedFeedstocks([]);
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CreateProductDTO = {
      productCode,
      name,
      unitPrice: Number(unitPrice),
      feedstocks: selectedFeedstocks
        .filter(f => f.feedstockId > 0 && f.quantity > 0)
        .map(f => ({
          feedstockId: Number(f.feedstockId),
          quantity: Number(f.quantity)
        }))
    };

    try {
      await dispatch(createProduct(payload)).unwrap();
      dispatch(fetchProducts({ page: 0, size: 5}));
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao criar produto. Verifique os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-stone-100">
          <h2 className="text-2xl font-serif text-stone-800">Cadastrar Novo Produto</h2>
          <button onClick={handleClose} className="text-stone-400 hover:text-stone-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nome do Produto</label>
              <input 
                required 
                className="w-full border-stone-200 rounded-lg focus:ring-amber-500" 
                value={name} onChange={e => setName(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Código SKU</label>
              <input 
                required 
                className="w-full border-stone-200 rounded-lg focus:ring-amber-500" 
                value={productCode} onChange={e => setProductCode(e.target.value)} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Preço (R$)</label>
              <input 
                required 
                type="number" step="0.01"
                className="w-full border-stone-200 rounded-lg focus:ring-amber-500" 
                value={unitPrice} onChange={e => setUnitPrice(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest">Matérias-Primas</h3>
              <button type="button" onClick={handleAddFeedstock} className="text-sm text-amber-700 font-semibold flex items-center gap-1">
                <Plus size={16} /> Adicionar
              </button>
            </div>

            {selectedFeedstocks.map((item, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <select 
                    required
                    className="w-full border-stone-200 rounded-lg text-sm"
                    value={item.feedstockId}
                    onChange={e => handleUpdateFeedstock(index, 'feedstockId', Number(e.target.value))}
                  >
                    <option value={0}>Selecione...</option>
                    {feedstocks.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <input 
                    required type="number" step="0.0001"
                    className="w-full border-stone-200 rounded-lg text-sm"
                    value={item.quantity} 
                    onChange={e => handleUpdateFeedstock(index, 'quantity', Number(e.target.value))} 
                  />
                </div>
                <button type="button" onClick={() => handleRemoveFeedstock(index)} className="p-2 text-stone-300 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-8 flex gap-3">
            <button type="button" onClick={handleClose} className="flex-1 px-6 py-3 border border-stone-200 rounded-xl">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-stone-900 text-white rounded-xl flex items-center justify-center gap-2 disabled:bg-stone-400"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}