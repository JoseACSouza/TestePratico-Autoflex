import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts, deleteProduct } from '../features/inventorySlice';
import { Plus, Search, ChevronLeft, ChevronRight, Loader2, Filter, RockingChair } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CreateProductModal from '../components/CreateProductModal';
import Footer from '../components/Footer';

type SearchType = 'name' | 'feedstock';

export default function ProductList() {
  const dispatch = useAppDispatch();
  const { products, loading, totalProducts } = useAppSelector((state) => state.inventory);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    dispatch(fetchProducts({
      page: currentPage,
      size: pageSize,
      q: searchTerm
    }));
  }, [dispatch, currentPage, searchTerm, searchType]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();

        dispatch(fetchProducts({
          page: currentPage,
          size: pageSize,
          q: searchTerm
        }));

      } catch (error) {
        alert("Erro ao excluir produto.");
      }
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as SearchType);
    setCurrentPage(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 font-bold tracking-tight">Catálogo de Produtos</h1>
            <p className="text-stone-500 mt-1 font-light italic">Gestão de mobiliário finalizado e capacidade fabril.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-amber-800 text-white px-8 py-4 rounded-xl hover:bg-amber-900 transition-all shadow-xl shadow-amber-900/20 active:scale-95 group font-semibold"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold tracking-wide">Novo Produto</span>
          </button>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-2 mb-8 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500/50 transition-all">
          <div className="flex flex-col md:flex-row items-center gap-2">

            <div className="relative w-full md:w-auto shrink-0">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <Filter size={16} />
              </div>
              <select
                value={searchType}
                onChange={handleTypeChange}
                className="w-full md:w-56 pl-10 pr-8 py-3 bg-stone-50 border-none rounded-xl text-sm font-medium text-stone-700 focus:ring-0 cursor-pointer appearance-none hover:bg-stone-100 transition-colors"
              >
                <option value="name">Buscar por Nome</option>
                <option value="feedstock">Usam Matéria-Prima...</option>
              </select>
            </div>

            <div className="h-8 w-px bg-stone-100 hidden md:block"></div>

            <div className="flex items-center flex-1 w-full px-3">
              <Search className="text-stone-400 mr-3" size={20} />
              <input
                type="text"
                placeholder={searchType === 'name' ? "Ex: Mesa de Centro..." : "Ex: Carvalho, Aço..."}
                className="w-full bg-transparent border-none focus:ring-0 text-stone-700 placeholder:text-stone-400 font-medium py-3"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-white border border-stone-200 rounded-2xl p-2 mb-8 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500/50 transition-all">
          {loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-stone-200">
              <Loader2 className="animate-spin text-amber-700 mb-4" size={40} />
              <p className="text-stone-500 font-serif italic text-lg">Consultando acervo Artesano...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                  onEdit={(p) => console.log("Editar:", p)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-stone-400">
              <RockingChair size={48} className="mb-4 opacity-20" />
              <p className="text-stone-400 text-lg mb-2">Nenhum produto encontrado.</p>
              <button
                onClick={() => { setSearchTerm(''); setSearchType('name'); }}
                className="text-amber-700 text-sm font-semibold hover:underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              disabled={currentPage === 0 || loading}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-2 border border-stone-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all text-stone-600 hover:text-amber-800 font-medium shadow-sm"
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            <div className="flex items-center gap-3">
              <span className="bg-white border border-stone-200 text-stone-800 w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-sm">
                {currentPage + 1}
              </span>
            </div>

            <button
              disabled={(currentPage + 1) * pageSize >= totalProducts || loading}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="flex items-center gap-2 px-6 py-2 border border-stone-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all text-stone-600 hover:text-amber-800 font-medium shadow-sm"
            >
              Próximo
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      <Footer />
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}