import { Link } from 'react-router-dom';
import { Layers, Box } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-serif text-stone-900 tracking-tight">Artesano</h1>
        <div className="h-1 w-20 bg-amber-700 mx-auto mt-2"></div>
        <p className="text-stone-500 mt-4 uppercase tracking-widest text-sm">Sistemas de Produção</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        <Link to="/materias-primas" className="group">
          <div className="h-80 bg-stone-100 rounded-lg overflow-hidden relative flex items-center justify-center border border-stone-200 transition-all group-hover:border-amber-700 group-hover:shadow-2xl">
            <div className="z-10 text-center">
              <Layers size={40} className="mx-auto text-stone-400 group-hover:text-amber-700 transition-colors" />
              <h2 className="mt-4 text-2xl font-light text-stone-800">Matérias-Primas</h2>
            </div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80')] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          </div>
        </Link>

        <Link to="/produtos" className="group">
          <div className="h-80 bg-stone-100 rounded-lg overflow-hidden relative flex items-center justify-center border border-stone-200 transition-all group-hover:border-amber-700 group-hover:shadow-2xl">
            <div className="z-10 text-center">
              <Box size={40} className="mx-auto text-stone-400 group-hover:text-amber-700 transition-colors" />
              <h2 className="mt-4 text-2xl font-light text-stone-800">Produtos</h2>
            </div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80')] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          </div>
        </Link>
      </div>
    </div>
  );
}