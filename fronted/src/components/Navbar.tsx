import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  
  if (location.pathname === "/") return null;

  return (
    <nav className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-stone-800 hover:text-amber-800 transition-colors group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-serif text-xl tracking-tight">Artesano</span>
      </Link>
      <div className="flex gap-6 text-sm uppercase tracking-widest font-medium text-stone-500">
        <Link to="/materias-primas" className={`hover:text-amber-800 transition-colors ${location.pathname.includes('materias') ? 'text-amber-800 border-b border-amber-800' : ''}`}>
          Materiais
        </Link>
        <Link to="/produtos" className={`hover:text-amber-800 transition-colors ${location.pathname.includes('produtos') ? 'text-amber-800 border-b border-amber-800' : ''}`}>
          Produtos
        </Link>
      </div>
    </nav>
  );
};