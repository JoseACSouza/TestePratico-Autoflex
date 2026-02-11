import { Trash2, Edit, Package, Info } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
}

export default function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  
  const calculatePossibleProduction = () => {
    if (!product.feedstocks || product.feedstocks.length === 0) return 0;

    const limits = product.feedstocks.map(fs => {
      if (fs.quantity <= 0) return Infinity;
      return Math.floor(fs.stock / fs.quantity);
    });

    const maxProduction = Math.min(...limits);
    return maxProduction === Infinity ? 0 : maxProduction;
  };

  const possibleUnits = calculatePossibleProduction();

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-amber-500/50 transition-all group shadow-sm hover:shadow-md">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        
        <div className="flex gap-6">
          <div className="w-24 h-24 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-amber-700 group-hover:bg-amber-50 transition-colors shrink-0">
            <Package size={40} />
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded uppercase tracking-tighter">
                {product.productCode}
              </span>
              <h3 className="text-2xl font-serif text-stone-800 mt-1">{product.name}</h3>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                possibleUnits > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                <Info size={14} />
                Capacidade de produção: <strong className="ml-1">{possibleUnits} unidades</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
          <div className="text-right">
            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">Preço de Venda</p>
            <p className="text-3xl font-light text-stone-900">
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.unitPrice)}
            </p>
          </div>
          
          <div className="flex gap-2 lg:mt-4">
            <button 
              onClick={() => onEdit(product)}
              className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-all"
              title="Editar"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete(product.id)}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Excluir"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-50 pt-4">
        {product.feedstocks.map(fs => (
          <div key={fs.id} className="text-[10px] flex items-center gap-1 bg-stone-50 text-stone-500 border border-stone-100 px-2 py-1 rounded">
            <span className="font-bold text-stone-700">{fs.name}:</span>
            <span>{fs.quantity.toFixed(2)} un.</span>
          </div>
        ))}
      </div>
    </div>
  );
}