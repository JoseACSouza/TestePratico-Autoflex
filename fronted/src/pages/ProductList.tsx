import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts, deleteProduct } from '../features/inventorySlice';
import { Plus, Search, Trash2, Edit, Package, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductList() {
  const dispatch = useAppDispatch();
  const { products, loading, totalProducts } = useAppSelector((state) => state.inventory);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, size: pageSize, q: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleDelete = (id: number) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-stone-900 font-bold">Catálogo de Produtos</h1>
          <p className="text-stone-500 mt-1">Gerencie os móveis finalizados e sua precificação.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full hover:bg-amber-800 transition-all shadow-lg hover:shadow-amber-900/20 active:scale-95">
          <Plus size={20} />
          <span className="font-medium">Novo Produto</span>
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-8 flex items-center gap-4 shadow-sm">
        <Search className="text-stone-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou código do produto..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-stone-700 placeholder:text-stone-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
          <p className="mt-4 text-stone-500 font-serif italic">Buscando catálogo...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-amber-500/50 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-amber-700 group-hover:bg-amber-50 transition-colors">
                    <Package size={40} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                      {product.productCode}
                    </span>
                    <h3 className="text-2xl font-serif text-stone-800 mt-2">{product.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.feedstocks.map(fs => (
                        <span key={fs.id} className="text-[10px] uppercase tracking-wider bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                          {fs.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
                  <div className="text-right">
                    <p className="text-xs text-stone-400 uppercase tracking-widest">Preço Sugerido</p>
                    <p className="text-3xl font-light text-stone-900">
                      {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.unitPrice)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-3 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-all">
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-3 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 flex items-center justify-center gap-8">
        <button 
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="p-2 border border-stone-200 rounded-full disabled:opacity-30 hover:bg-white transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        
        <span className="text-stone-600 font-medium">
          Página <span className="text-stone-900">{currentPage + 1}</span>
        </span>

        <button 
          disabled={(currentPage + 1) * pageSize >= totalProducts}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="p-2 border border-stone-200 rounded-full disabled:opacity-30 hover:bg-white transition-all shadow-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}