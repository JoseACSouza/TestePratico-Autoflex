import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFeedstocks } from '../features/inventorySlice';
import { Plus, Search, ChevronLeft, ChevronRight, Loader2, Layers } from 'lucide-react';
import CreateFeedstockModal from '../components/CreateFeedstockModal';

export default function FeedstockList() {
  const dispatch = useAppDispatch();
  const { feedstocks, loading, totalFeedstocks } = useAppSelector((state) => state.inventory);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchFeedstocks({ page: currentPage, size: pageSize, q: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-stone-900 font-bold tracking-tight">Matérias-Primas</h1>
          <p className="text-stone-500 mt-1 font-light italic">Controle de insumos, chapas, tecidos e ferragens.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-amber-800 text-white px-8 py-4 rounded-xl hover:bg-amber-900 transition-all shadow-xl shadow-amber-900/20 active:scale-95 group font-medium"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Novo Material
        </button>
      </div>

      {/* Busca */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-8 flex items-center gap-4 shadow-sm">
        <Search className="text-stone-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Buscar material pelo nome ou código..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-stone-700 placeholder:text-stone-400 font-medium"
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(0);}}
        />
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
        {loading && feedstocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-amber-700 mb-4" size={40} />
            <p className="text-stone-500 font-serif italic">Inventariando materiais...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-8 py-5">Cód. SKU</th>
                  <th className="px-8 py-5">Descrição do Material</th>
                  <th className="px-8 py-5">Unid.</th>
                  <th className="px-8 py-5 text-right">Estoque Atual</th>
                  <th className="px-8 py-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {feedstocks.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded">
                        {item.feedstockCode}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-medium text-stone-800">{item.name}</td>
                    <td className="px-8 py-5 text-stone-400 text-sm">{item.unitOfMeasure}</td>
                    <td className="px-8 py-5 text-right font-mono text-stone-900 font-bold">
                      {Number(item.stock).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button className="text-stone-300 hover:text-stone-600 transition-colors">
                        <Layers size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginação */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button 
          disabled={currentPage === 0 || loading}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="p-3 border border-stone-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-serif text-stone-800">Página {currentPage + 1}</span>
        <button 
          disabled={(currentPage + 1) * pageSize >= totalFeedstocks || loading}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="p-3 border border-stone-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <CreateFeedstockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}