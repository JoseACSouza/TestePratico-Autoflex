import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import FeedstockList from './pages/FeedstockList';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* O Navbar decide internamente se aparece ou não */}
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<ProductList />} />
            <Route path="/materias-primas" element={<FeedstockList />} />
            <Route path="*" element={<div className="p-20 text-center">Página não encontrada.</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;