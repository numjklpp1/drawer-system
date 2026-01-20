
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

  // 💡 [標註] 核心計算區：在這裡補完掀門的加總邏輯
  const drawerTotals = useMemo((): DrawerTotals => {
    return selectedItems.reduce((acc, item) => ({
      udLarge: acc.udLarge + (item.udLarge * item.quantity),
      udMedium: acc.udMedium + (item.udMedium * item.quantity),
      udSmall: acc.udSmall + (item.udSmall * item.quantity),
      udP: acc.udP + (item.udP * item.quantity), // 補完 UD 掀門計算
      adLarge: acc.adLarge + (item.adLarge * item.quantity),
      adSmall: acc.adSmall + (item.adSmall * item.quantity),
      adP: acc.adP + (item.adP * item.quantity), // 補完 AD 掀門計算
      cdLarge: acc.cdLarge + (item.cdLarge * item.quantity),
      cdSmall: acc.cdSmall + (item.cdSmall * item.quantity),
    }), {
      udLarge: 0, udMedium: 0, udSmall: 0, udP: 0,
      adLarge: 0, adSmall: 0, adP: 0,
      cdLarge: 0, cdSmall: 0
    });
  }, [selectedItems]);

  const analyzeWithGemini = async () => {
    if (selectedItems.length === 0) return;
    
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        我有以下櫃子庫存統計：
        UD系列：大 ${drawerTotals.udLarge}, 中 ${drawerTotals.udMedium}, 小 ${drawerTotals.udSmall}, 掀門 ${drawerTotals.udP}
        AD系列：大 ${drawerTotals.adLarge}, 小 ${drawerTotals.adSmall}, 掀門 ${drawerTotals.adP}
        CD系列：大 ${drawerTotals.cdLarge}, 小 ${drawerTotals.cdSmall}
        
        請根據抽屜與掀門的分類與數量，給出簡短的專業收納或盤點建議。回覆繁體中文。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiAnalysis(response.text);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAiAnalysis("分析失敗，請檢查網路。");
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
          <div className="text-xs text-slate-500 font-mono hidden sm:block">v2.1 Full Logic</div>
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
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
                  <h3 className="text-blue-400 font-black mb-3 text-xl border-b border-slate-800 pb-2">UD 系列</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-slate-400">大抽屜</span><span className="text-2xl font-bold">{drawerTotals.udLarge}</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">中抽屜</span><span className="text-2xl font-bold">{drawerTotals.udMedium}</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">小抽屜</span><span className="text-2xl font-bold">{drawerTotals.udSmall}</span></div>
                    
                    <div className="flex justify-between items-center"><span className="text-slate-400">掀門</span><span className="text-2xl font-bold">{drawerTotals.udP}</span></div>
                  </div>
                </div>

                {/* AD 統計卡片 */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
                  <h3 className="text-green-400 font-black mb-3 text-xl border-b border-slate-800 pb-2">AD 系列</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-slate-400">大抽屜</span><span className="text-2xl font-bold">{drawerTotals.adLarge}</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">小抽屜</span><span className="text-2xl font-bold">{drawerTotals.adSmall}</span></div>
                    
                    <div className="flex justify-between items-center"><span className="text-slate-400">掀門</span><span className="text-2xl font-bold">{drawerTotals.adP}</span></div>
                  </div>
                </div>

                {/* CD 統計卡片 */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
                  <h3 className="text-purple-400 font-black mb-3 text-xl border-b border-slate-800 pb-2">CD 系列</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-slate-400">大抽屜</span><span className="text-2xl font-bold">{drawerTotals.cdLarge}</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">小抽屜</span><span className="text-2xl font-bold">{drawerTotals.cdSmall}</span></div>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={analyzeWithGemini}
              disabled={isAiProcessing}
              className="w-full py-3 bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-xl text-slate-400 hover:text-indigo-400 transition-all text-sm font-medium"
            >
              {isAiProcessing ? 'AI 正在分析數據...' : '✨ 獲取庫存配置建議 (AI)'}
            </button>
            
            {aiAnalysis && (
              <div className="bg-indigo-950/20 backdrop-blur p-4 rounded-lg border border-indigo-900/30 text-slate-300 text-sm animate-fade-in">
                {aiAnalysis}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-900 py-8 text-center text-slate-700 text-xs">
        <p>© 2024 Cabinet Drawer Summary System.</p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
