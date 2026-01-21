
import React, { useState, useCallback, useMemo } from 'react';
import { CabinetModel, SelectedItem, DrawerTotals } from './types';
import CabinetSelector from './components/CabinetSelector';
import ResultTable from './components/ResultTable';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const addItem = useCallback((model: CabinetModel, quantity: number) => {
    const newItem: SelectedItem = {
      ...model,
      instanceId: `${model.id}-${Date.now()}`,
      quantity: quantity
    };
    setSelectedItems(prev => [...prev, newItem]);
    setAiAnalysis(null);
    setShowSummary(false);
  }, []);

  const removeItem = useCallback((instanceId: string) => {
    setSelectedItems(prev => prev.filter(item => item.instanceId !== instanceId));
    setAiAnalysis(null);
  }, []);

  const clearAll = useCallback(() => {
    if (confirm('確定要清空清單嗎？')) {
      setSelectedItems([]);
      setAiAnalysis(null);
      setShowSummary(false);
    }
  }, []);

  const drawerTotals = useMemo((): DrawerTotals => {
    return selectedItems.reduce((acc, item) => ({
      udL: acc.udL + (item.udL * item.quantity),
      udM: acc.udM + (item.udM * item.quantity),
      udS: acc.udS + (item.udS * item.quantity),
      udP: acc.udP + (item.udP * item.quantity),
      udF: acc.udF + (item.udF * item.quantity),
      adL: acc.adL + (item.adL * item.quantity),
      adS: acc.adS + (item.adS * item.quantity),
      adP: acc.adP + (item.adP * item.quantity),
      ctL: acc.ctL + (item.ctL * item.quantity),
      cbL: acc.cbL + (item.cbL * item.quantity),
      cbS: acc.cbS + (item.cbS * item.quantity),
    }), {
      udL: 0, udM: 0, udS: 0, udP: 0, udF: 0,
      adL: 0, adS: 0, adP: 0,
      ctL: 0,
      cbL: 0, cbS: 0
    });
  }, [selectedItems]);

  const analyzeWithGemini = async () => {
    if (selectedItems.length === 0) return;
    
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        我有以下庫存統計：
        UD系列: L:${drawerTotals.udL}, M:${drawerTotals.udM}, S:${drawerTotals.udS}, P:${drawerTotals.udP}, F:${drawerTotals.udF}
        AD系列: L:${drawerTotals.adL}, S:${drawerTotals.adS}, P:${drawerTotals.adP}
        CT系列: L:${drawerTotals.ctL}
        CB系列: L:${drawerTotals.cbL}, S:${drawerTotals.cbS}
        
        請給出簡短盤點建議。回覆繁體中文。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiAnalysis(response.text);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAiAnalysis("分析失敗。");
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-black text-white">
      <header className="bg-slate-900/50 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">抽屜分類統整系統</h1>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden sm:block">v3.2 Updated CD</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <CabinetSelector onAdd={addItem} />

        <ResultTable 
          items={selectedItems} 
          onRemove={removeItem} 
          onClear={clearAll} 
        />

        {selectedItems.length > 0 && (
          <div className="mt-8 space-y-4">
            <button 
              onClick={() => setShowSummary(!showSummary)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {showSummary ? '隱藏統整結果' : '點選統整抽屜總量'}
            </button>

            {showSummary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                {/* UD 統計卡片 */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
                  <h3 className="text-blue-400 font-black mb-3 text-lg border-b border-slate-800 pb-2">理想櫃 (UD)</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center"><span className="text-slate-400">udL (大)</span><span className="text-xl font-bold">{drawerTotals.udL}</span></div>
                    <div className="flex justify-between items-center border-t border-slate-800/50 pt-1"><span className="text-slate-400">udM (中)</span><span className="text-xl font-bold">{drawerTotals.udM}</span></div>
                    <div className="flex justify-between items-center border-t border-slate-800/50 pt-1"><span className="text-slate-400">udS (小)</span><span className="text-xl font-bold">{drawerTotals.udS}</span></div>
                    <div className="flex justify-between items-center border-t border-slate-800/50 pt-1"><span className="text-slate-400">udP (掀)</span><span className="text-xl font-bold">{drawerTotals.udP}</span></div>
                    <div className="flex justify-between items-center border-t border-slate-800/50 pt-1"><span className="text-slate-400">udF (F把)</span><span className="text-xl font-bold">{drawerTotals.udF}</span></div>
                  </div>
                </div>

                {/* AD 統計卡片 */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
                  <h3 className="text-green-400 font-black mb-3 text-lg border-b border-slate-800 pb-2">AD 系列</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center"><span className="text-slate-400">adL (大)</span><span className="text-xl font-bold">{drawerTotals.adL}</span></div>
                    <div className="flex justify-between items-center border-t border-slate-800/50 pt-1"><span className="text-slate-400">adS (小)</span><span className="text-xl font-bold">{drawerTotals.adS}</span></div>
                    <div className="flex justify-between items-center border-t border-slate-800/50 pt-1"><span className="text-slate-400">adP (掀)</span><span className="text-xl font-bold">{drawerTotals.adP}</span></div>
                  </div>
                </div>

                {/* CD 統計卡片 (合併 CT 與 CB) */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
                  <h3 className="text-amber-400 font-black mb-3 text-lg border-b border-slate-800 pb-2">CD 系列</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center"><span className="text-slate-400">ctL (CT大)</span><span className="text-xl font-bold">{drawerTotals.ctL}</span></div>
                    <div className="flex justify-between items-center border-t border-slate-800/50 pt-1"><span className="text-slate-400">cbL (CB大)</span><span className="text-xl font-bold">{drawerTotals.cbL}</span></div>
                    <div className="flex justify-between items-center border-t border-slate-800/50 pt-1"><span className="text-slate-400">cbS (CB小)</span><span className="text-xl font-bold">{drawerTotals.cbS}</span></div>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={analyzeWithGemini}
              disabled={isAiProcessing}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              {isAiProcessing ? (
                <span className="flex items-center gap-2 italic">
                  <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 分析中...
                </span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  使用 AI 生成建議
                </>
              )}
            </button>

            {aiAnalysis && (
              <div className="p-5 bg-slate-900/80 border border-blue-900/30 rounded-xl text-slate-200 text-sm leading-relaxed shadow-inner animate-fade-in">
                <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Gemini 分析結果
                </div>
                {aiAnalysis}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-900 py-8 px-4 text-center">
        <p className="text-slate-600 text-xs tracking-widest">CABINET CALCULATOR &copy; 2024 PROFESSIONAL GRADE</p>
      </footer>
    </div>
  );
};

export default App;
