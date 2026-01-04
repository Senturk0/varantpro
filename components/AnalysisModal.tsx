import React, { useState } from 'react';
import { Warrant } from '../types';
import { analyzeWarrant } from '../services/geminiService';
import { X, Bot, TrendingUp, AlertTriangle, Clock, Calendar, Gauge, Calculator, Percent } from 'lucide-react';

interface AnalysisModalProps {
  warrant: Warrant | null;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ warrant, onClose }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  if (!warrant) return null;

  const handleAnalyze = () => {
    setLoading(true);
    setIsAnalyzed(true);
    analyzeWarrant(warrant)
      .then(text => setAnalysis(text))
      .catch(() => setAnalysis("Analiz sırasında bir hata oluştu."))
      .finally(() => setLoading(false));
  };

  const InfoRow = ({ label, value, highlight = false, subtext = '' }: { label: string, value: string | number, highlight?: boolean, subtext?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <div className="text-right">
        <span className={`font-mono font-medium ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-200'}`}>
          {value}
        </span>
        {subtext && <span className="block text-[10px] text-slate-500 dark:text-slate-600">{subtext}</span>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transition-colors">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900 p-5 flex justify-between items-start border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className={`mt-1 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 ${warrant.type === 'ALIM' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500'}`}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{warrant.symbol}</h3>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${warrant.type === 'ALIM' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                    {warrant.type}
                 </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{warrant.underlying} Dayanak Varlıklı {warrant.issuer} Varantı</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Left Column: Basic Info & Prices */}
            <div className="space-y-6">
               <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    <Calculator size={16} className="text-blue-500" />
                    Fiyat & Vade Parametreleri
                  </h4>
                  <div className="space-y-1">
                    <InfoRow label="Anlık Fiyat" value={`${warrant.price} TL`} highlight />
                    <InfoRow label="Kullanım Fiyatı" value={`${warrant.strikePrice} TL`} />
                    <InfoRow label="Vade" value={warrant.maturity} />
                    <InfoRow label="Kalan Gün" value="Hesaplanıyor..." subtext="Vade sonuna" />
                    <InfoRow label="Çarpan" value={warrant.conversionRatio} />
                    <InfoRow label="Başabaş Noktası" value={`${warrant.breakEven} TL`} />
                  </div>
               </div>
            </div>

            {/* Right Column: Greeks & Risk */}
            <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    <Gauge size={16} className="text-purple-500" />
                    Risk ve Duyarlılık (Greeks)
                  </h4>
                  <div className="space-y-1">
                    <InfoRow label="Etkin Kaldıraç" value={`${warrant.effectiveLeverage}x`} highlight />
                    <InfoRow label="Delta (Duyarlılık)" value={warrant.delta} />
                    <InfoRow label="Gamma" value={warrant.gamma} />
                    <InfoRow label="Theta (Zaman Kaybı)" value={warrant.theta} subtext="Günlük değer kaybı" />
                    <InfoRow label="Vega" value={warrant.vega} />
                    <InfoRow label="Moneyness" value={warrant.status} />
                  </div>
               </div>
            </div>
          </div>

          {/* AI Analysis Section (On Demand) */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
             {!isAnalyzed ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-dashed border border-slate-300 dark:border-slate-800">
                    <Bot size={48} className="text-slate-400 dark:text-slate-600" />
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Yapay Zeka Analizi</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mt-1">
                            Bu varantın risk yapısını ve piyasa senaryolarını Gemini AI ile analiz etmek ister misiniz?
                        </p>
                    </div>
                    <button 
                        onClick={handleAnalyze}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                        <Bot size={18} />
                        Analizi Başlat
                    </button>
                </div>
             ) : (
                <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                            <Bot size={20} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">Gemini AI Analizi</h4>
                    </div>
                    
                    {loading ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-2 bg-indigo-200 dark:bg-indigo-900/50 rounded w-3/4"></div>
                            <div className="h-2 bg-indigo-200 dark:bg-indigo-900/50 rounded w-full"></div>
                            <div className="h-2 bg-indigo-200 dark:bg-indigo-900/50 rounded w-5/6"></div>
                            <p className="text-xs text-indigo-500 dark:text-indigo-400/60 mt-2 font-mono">Veriler işleniyor...</p>
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {analysis}
                        </div>
                    )}
                </div>
             )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <Clock size={14} />
                 <span>Veri gecikmeli: 15dk</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <AlertTriangle size={14} />
                 <span>YTD</span>
              </div>
           </div>
           <div>VarantPro BIST Data v1.2</div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisModal;