
import React, { useState } from 'react';
import { CabinetModel } from '../types';
import { CABINET_MODELS } from '../constants';

interface CabinetSelectorProps {
  onAdd: (model: CabinetModel, quantity: number) => void;
}

const CabinetSelector: React.FC<CabinetSelectorProps> = ({ onAdd }) => {
  const [selectedId, setSelectedId] = useState<string>(CABINET_MODELS[0].id);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAdd = () => {
    const model = CABINET_MODELS.find(m => m.id === selectedId);
    if (model) {
      onAdd(model, quantity);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-xl border border-slate-800 mb-8">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        選取產品
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">產品型號</label>
          <select 
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
          >
            {CABINET_MODELS.map(model => (
              <option key={model.id} value={model.id} className="bg-slate-900">
                {model.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">購買/計算數量</label>
          <input 
            type="number" 
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          />
        </div>
        <div className="flex items-end">
          <button 
            onClick={handleAdd}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20 active:scale-[0.98]"
          >
            加入清單
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabinetSelector;
