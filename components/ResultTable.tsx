
import React from 'react';
import { SelectedItem } from '../types';

interface ResultTableProps {
  items: SelectedItem[];
  onRemove: (instanceId: string) => void;
  onClear: () => void;
}

const ResultTable: React.FC<ResultTableProps> = ({ items, onRemove, onClear }) => {
  const totalCabinets = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-900 rounded-xl shadow-xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h2 className="text-md font-semibold text-slate-300">已選清單</h2>
        <button onClick={onClear} className="text-xs text-red-500 hover:text-red-400 transition-colors">清空全部</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-500 text-[10px] uppercase tracking-tighter">
              {/* 💡 [標註] 名稱方框寬度：w-3/5 控制名稱格子的佔比 */}
              <th className="px-6 py-3 font-semibold w-3/5">產品名稱</th>
              {/* 💡 [標註] 數量方框寬度：px-2 讓數量更靠近名稱 */}
              <th className="px-2 py-3 font-semibold text-left">數量</th>
              <th className="px-6 py-3 font-semibold text-right w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((item) => (
              <tr key={item.instanceId} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-slate-200 font-medium text-sm">
                  {item.name}
                </td>
                <td className="px-2 py-4 text-white text-left font-bold text-lg">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onRemove(item.instanceId)} className="text-slate-600 hover:text-red-500 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-950/50">
            <tr className="border-t border-slate-800">
              <td className="px-6 py-3 text-slate-500 text-xs font-bold uppercase">總櫃子數</td>
              <td className="px-2 py-3 text-left font-black text-blue-500 text-xl">{totalCabinets}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;
