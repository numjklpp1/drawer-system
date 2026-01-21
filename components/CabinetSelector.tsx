
import React, { useState, useMemo } from 'react';
import { CabinetModel } from '../types';
import { CABINET_MODELS } from '../constants';

interface CabinetSelectorProps {
  onAdd: (model: CabinetModel, quantity: number) => void;
}

const CabinetSelector: React.FC<CabinetSelectorProps> = ({ onAdd }) => {
  const [selectedModel, setSelectedModel] = useState<CabinetModel>(CABINET_MODELS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('U');

  // 將模型按類別分組
  const groupedModels = useMemo(() => {
    const groups = {
      U: [] as CabinetModel[],
      A: [] as CabinetModel[],
      C: [] as CabinetModel[]
    };

    CABINET_MODELS.forEach(model => {
      const id = model.id.toUpperCase();
      if (id.startsWith('UD') || id.startsWith('UP') || id.startsWith('UC') || id === '138') {
        groups.U.push(model);
      } else if (id.startsWith('AD') || id.startsWith('AC')) {
        groups.A.push(model);
      } else if (id.startsWith('CB') || id.startsWith('CT')) {
        groups.C.push(model);
      }
    });
    return groups;
  }, []);

  const handleAdd = () => {
    onAdd(selectedModel, quantity);
    setIsMenuOpen(false);
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  const selectModel = (model: CabinetModel) => {
    setSelectedModel(model);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-xl border border-slate-800 mb-8 relative">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        選取產品
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 自定義下拉選單容器 */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-400 mb-1">產品型號</label>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex justify-between items-center p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-left"
          >
            <span>{selectedModel.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 下拉內容 */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-hidden flex flex-col">
              <div className="overflow-y-auto p-2 space-y-2">
                
                {/* U 系列 */}
                <div>
                  <button 
                    onClick={() => toggleCategory('U')}
                    className="w-full flex justify-between items-center p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-sm font-bold text-blue-400"
                  >
                    <span>U 系列 (UD, UP, UC, 138)</span>
                    <span>{expandedCategory === 'U' ? '−' : '+'}</span>
                  </button>
                  {expandedCategory === 'U' && (
                    <div className="grid grid-cols-2 gap-1 p-2 bg-slate-950">
                      {groupedModels.U.map(m => (
                        <button
                          key={m.id}
                          onClick={() => selectModel(m)}
                          className={`text-left p-2 text-xs rounded hover:bg-blue-600/20 transition-colors ${selectedModel.id === m.id ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* A 系列 */}
                <div>
                  <button 
                    onClick={() => toggleCategory('A')}
                    className="w-full flex justify-between items-center p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-sm font-bold text-green-400"
                  >
                    <span>A 系列 (AD, AC)</span>
                    <span>{expandedCategory === 'A' ? '−' : '+'}</span>
                  </button>
                  {expandedCategory === 'A' && (
                    <div className="grid grid-cols-2 gap-1 p-2 bg-slate-950">
                      {groupedModels.A.map(m => (
                        <button
                          key={m.id}
                          onClick={() => selectModel(m)}
                          className={`text-left p-2 text-xs rounded hover:bg-green-600/20 transition-colors ${selectedModel.id === m.id ? 'bg-green-600 text-white' : 'text-slate-400'}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* C 系列 */}
                <div>
                  <button 
                    onClick={() => toggleCategory('C')}
                    className="w-full flex justify-between items-center p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-sm font-bold text-amber-400"
                  >
                    <span>C 系列 (CB, CT)</span>
                    <span>{expandedCategory === 'C' ? '−' : '+'}</span>
                  </button>
                  {expandedCategory === 'C' && (
                    <div className="grid grid-cols-2 gap-1 p-2 bg-slate-950">
                      {groupedModels.C.map(m => (
                        <button
                          key={m.id}
                          onClick={() => selectModel(m)}
                          className={`text-left p-2 text-xs rounded hover:bg-amber-600/20 transition-colors ${selectedModel.id === m.id ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
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

      {/* 點擊外部關閉選單的遮罩 */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 cursor-default" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default CabinetSelector;
