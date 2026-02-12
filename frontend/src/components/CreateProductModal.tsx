import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Package, DollarSign, Hash, Layers, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFeedstocks, createProduct, fetchProducts } from '../features/inventorySlice';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const dispatch = useAppDispatch();
  const { feedstocks } = useAppSelector((state) => state.inventory);

  const [name, setName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  
  const [selectedItems, setSelectedItems] = useState<{ feedstockId: number; name: string; quantity: number }[]>([]);
  
  const [currentFsId, setCurrentFsId] = useState<number>(0);
  const [currentQty, setCurrentQty] = useState<number>(0);

  useEffect(() => {
    if (isOpen) dispatch(fetchFeedstocks({ page: 0, size: 100 }));
  }, [isOpen, dispatch]);

  const handleAddItem = () => {
    const fs = feedstocks.find(f => f.id === currentFsId);
    if (fs && currentQty > 0) {
      setSelectedItems([...selectedItems, { feedstockId: fs.id, name: fs.name, quantity: currentQty }]);
      setCurrentFsId(0);
      setCurrentQty(0);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) return;

    const payload = {
      name,
      productCode,
      unitPrice,
      feedstocks: selectedItems.map(item => ({
        feedstockId: item.feedstockId,
        quantity: item.quantity
      }))
    };

    try {
      await dispatch(createProduct(payload)).unwrap();
      dispatch(fetchProducts({ page: 0, size: 5 }));
      onClose();
      
      setName(''); setProductCode(''); setUnitPrice(0); setSelectedItems([]);
    } catch (err) {
      alert("Erro ao criar produto");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif text-stone-800">Novo Produto</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <X size={24} className="text-stone-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block ml-1">Nome do Móvel</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    required
                    placeholder="Ex: Poltrona de Couro Legítimo"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-stone-300"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block ml-1">Código (SKU)</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    required
                    placeholder="P001"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={productCode} onChange={(e) => setProductCode(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block ml-1">Preço Unitário</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    required type="number" step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-6">
              <h3 className="flex items-center gap-2 text-stone-700 font-semibold mb-4">
                <Layers size={18} className="text-amber-700" />
                Composição do Produto
              </h3>

              <div className="flex gap-2 mb-4">
                <select 
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500"
                  value={currentFsId} onChange={(e) => setCurrentFsId(Number(e.target.value))}
                >
                  <option value={0}>Selecione uma matéria-prima...</option>
                  {feedstocks.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.unitOfMeasure})</option>
                  ))}
                </select>
                <input 
                  type="number" placeholder="Qtd" className="w-24 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 outline-none focus:border-amber-500"
                  value={currentQty} onChange={(e) => setCurrentQty(Number(e.target.value))}
                />
                <button 
                  type="button" onClick={handleAddItem}
                  className="bg-stone-100 text-stone-600 p-2 rounded-xl hover:bg-stone-200 transition-colors"
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="bg-stone-50 rounded-2xl border border-stone-100 min-h-100px p-4">
                {selectedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-stone-400 py-4">
                    <AlertCircle size={20} className="mb-1" />
                    <p className="text-sm italic">Mínimo de 1 matéria-prima obrigatório</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {selectedItems.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-stone-200 animate-in slide-in-from-left-2">
                        <span className="text-sm font-medium text-stone-700">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-amber-700">{item.quantity} unidades</span>
                          <button onClick={() => handleRemoveItem(idx)} className="text-stone-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" onClick={onClose}
                className="flex-1 px-6 py-4 rounded-xl border border-stone-200 text-stone-500 font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={selectedItems.length === 0}
                className="flex-1 px-6 py-4 rounded-xl bg-stone-900 text-white font-semibold hover:bg-amber-800 disabled:opacity-30 disabled:hover:bg-stone-900 transition-all shadow-lg shadow-stone-900/20"
              >
                Criar Produto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}