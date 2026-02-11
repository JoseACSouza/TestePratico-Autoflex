// src/pages/FeedstockList.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFeedstocks } from '../features/inventorySlice';

export default function FeedstockList() {
  const dispatch = useAppDispatch();
  const { feedstocks, loading } = useAppSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchFeedstocks({ page: 1, size: 10 }));
  }, [dispatch]);

  return (
    <div className="p-10 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-serif text-stone-800">Inventário de Matérias</h2>
        <span className="text-sm text-stone-400">Total: {feedstocks.length} itens</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500 uppercase text-xs tracking-wider">
              <th className="py-4">Cód.</th>
              <th className="py-4">Nome</th>
              <th className="py-4 text-right">Estoque</th>
              <th className="py-4 text-center">Unidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {feedstocks.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                <td className="py-4 font-mono text-sm text-amber-800">{item.feedstockCode}</td>
                <td className="py-4 font-medium text-stone-700">{item.name}</td>
                <td className="py-4 text-right tabular-nums">
                  {Number(item.stock).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-4 text-center text-stone-400 text-sm">{item.unitOfMeasure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}