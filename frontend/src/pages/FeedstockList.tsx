import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFeedstocks, deleteFeedstock } from '../features/inventorySlice';
import { 
  Plus, Search, ChevronLeft, ChevronRight, 
  Loader2, Layers, Trash2, Edit3, PackageOpen 
} from 'lucide-react';
import CreateFeedstockModal from '../components/CreateFeedstockModal';
import Footer from '../components/Footer';

export default function FeedstockList() {
  const dispatch = useAppDispatch();
  const { feedstocks, loading, totalFeedstocks } = useAppSelector((state) => state.inventory);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchFeedstocks({ 
      page: currentPage, 
      size: pageSize, 
      q: searchTerm 
    }));
  }, [dispatch, currentPage, searchTerm]);

  const handleDelete = async (id: number) => {
    const itemToDelete = feedstocks.find(f => f.id === id);

    if (itemToDelete && itemToDelete.products && itemToDelete.products.length > 0) {
      alert(
        `TRAVA DE SEGURANÇA: \n\n` +
        `Não é possível excluir "${itemToDelete.name}" porque ela está sendo utilizada na composição de ${itemToDelete.products.length} produto(s). \n\n` +
        `Remova este material dos produtos antes de tentar excluir.`
      );
      return;
    }

    if (window.confirm(`Deseja realmente excluir "${itemToDelete?.name}"?`)) {
      try {
        await dispatch(deleteFeedstock(id)).unwrap();
        
        if (feedstocks.length === 1 && currentPage > 0) {
          setCurrentPage(prev => prev - 1);
        } else {
          dispatch(fetchFeedstocks({ page: currentPage, size: pageSize, q: searchTerm }));
        }
      } catch (error) {
        alert("Erro técnico ao excluir material.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 font-bold tracking-tight">Matérias-Primas</h1>
            <p className="text-stone-500 mt-1 font-light italic">Gestão de insumos, chapas, tecidos e ferragens para produção.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-amber-800 text-white px-8 py-4 rounded-xl hover:bg-amber-900 transition-all shadow-xl shadow-amber-900/20 active:scale-95 group font-semibold"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Novo Material
          </button>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-8 flex items-center gap-4 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
          <Search className="text-stone-400 ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Buscar material pelo nome ou código SKU..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-stone-700 placeholder:text-stone-400 font-medium"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          {loading && feedstocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-amber-700 mb-4" size={40} />
              <p className="text-stone-500 font-serif italic">Inventariando materiais...</p>
            </div>
          ) : feedstocks.length > 0 ? (
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
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-800">{item.name}</span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-tighter">
                            Presente em {item.products?.length || 0} composições
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-stone-400 text-sm font-medium">{item.unitOfMeasure}</td>
                      <td className="px-8 py-5 text-right font-mono text-stone-900 font-bold">
                        {Number(item.stock).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            title="Ver detalhes"
                            className="p-2 text-stone-400 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                          >
                            <Layers size={18} />
                          </button>
                          <button 
                            title="Editar"
                            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            title="Excluir"
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-stone-400">
              <PackageOpen size={48} className="mb-4 opacity-20" />
              <p className="font-serif italic text-lg">Nenhum material encontrado.</p>
            </div>
          )}
        </div>

        {feedstocks.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-6">
            <button 
              disabled={currentPage === 0 || loading}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all text-stone-600 font-medium shadow-sm"
            >
              <ChevronLeft size={18} /> Anterior
            </button>
            
            <span className="font-serif text-stone-800 font-bold bg-white px-4 py-2 rounded-lg border border-stone-100 shadow-sm">
              {currentPage + 1}
            </span>

            <button 
              disabled={(currentPage + 1) * pageSize >= totalFeedstocks || loading}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all text-stone-600 font-medium shadow-sm"
            >
              Próximo <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      <Footer />

      <CreateFeedstockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}