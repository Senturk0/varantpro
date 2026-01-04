import React, { useState, useMemo } from 'react';
import { Warrant, WarrantType } from '../types';
import WarrantTable from './WarrantTable';
import { Wand2, TrendingUp, TrendingDown, Shield, Zap, Target, ArrowRight, RotateCcw } from 'lucide-react';

interface WarrantWizardProps {
  allWarrants: Warrant[];
  onSelectWarrant: (w: Warrant) => void;
  onCompare: (w: Warrant) => void;
  compareList: Warrant[];
}

type Direction = 'UP' | 'DOWN' | null;
type RiskProfile = 'LOW' | 'MEDIUM' | 'HIGH' | null;

const WarrantWizard: React.FC<WarrantWizardProps> = ({ allWarrants, onSelectWarrant, onCompare, compareList }) => {
  const [selectedUnderlying, setSelectedUnderlying] = useState<string>('');
  const [direction, setDirection] = useState<Direction>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(null);
  const [showResults, setShowResults] = useState(false);

  const underlyingAssets = Array.from(new Set(allWarrants.map(w => w.underlying))).sort();

  const handleReset = () => {
    setSelectedUnderlying('');
    setDirection(null);
    setRiskProfile(null);
    setShowResults(false);
  };

  const recommendedWarrants = useMemo(() => {
    if (!showResults || !selectedUnderlying || !direction || !riskProfile) return [];

    return allWarrants.filter(w => {
      // 1. Filter by Underlying
      if (w.underlying !== selectedUnderlying) return false;

      // 2. Filter by Direction (Call vs Put)
      const targetType = direction === 'UP' ? WarrantType.CALL : WarrantType.PUT;
      if (w.type !== targetType) return false;

      // 3. Filter by Risk Profile (Logic based on Delta, Leverage and Status)
      // LOW RISK: High Delta (Deep ITM), Lower Leverage
      // MEDIUM RISK: Delta ~0.5 (ATM), Medium Leverage
      // HIGH RISK: Low Delta (OTM), High Leverage
      
      const absDelta = Math.abs(w.delta);
      
      if (riskProfile === 'LOW') {
         // Conservative: ITM or close to it, Delta > 0.6
         return (w.status === 'ITM' || absDelta > 0.6) && w.effectiveLeverage < 8;
      } else if (riskProfile === 'MEDIUM') {
         // Balanced: ATM range, Delta 0.3 - 0.6
         return absDelta >= 0.3 && absDelta <= 0.7 && w.effectiveLeverage >= 5 && w.effectiveLeverage <= 15;
      } else {
         // Aggressive: OTM, Delta < 0.4, High Leverage
         return (w.status === 'OTM' || absDelta < 0.4) && w.effectiveLeverage > 10;
      }
    }).sort((a, b) => b.effectiveLeverage - a.effectiveLeverage); // Sort by leverage by default
  }, [allWarrants, selectedUnderlying, direction, riskProfile, showResults]);

  if (showResults) {
      return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Wand2 className="text-indigo-500" />
                          Sihirbaz Sonuçları
                      </h2>
                      <p className="text-slate-500 mt-1">
                          {selectedUnderlying} için {direction === 'UP' ? 'Yükseliş' : 'Düşüş'} beklentili, {riskProfile === 'HIGH' ? 'Yüksek' : (riskProfile === 'MEDIUM' ? 'Orta' : 'Düşük')} risk profilli varantlar.
                      </p>
                  </div>
                  <button 
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                      <RotateCcw size={16} />
                      Kriterleri Değiştir
                  </button>
              </div>

              <WarrantTable 
                  warrants={recommendedWarrants} 
                  onSelect={onSelectWarrant} 
                  compareList={compareList}
                  onToggleCompare={onCompare}
                  isCompareMode={true} // Enable select mode by default here
              />
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Varant Seçim Sihirbazı</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Yatırım stratejinize en uygun varantı bulmak için aşağıdaki adımları tamamlayın. 
                Risk tercihinize ve piyasa beklentinize göre en iyi seçenekleri filtreleyelim.
            </p>
        </div>

        {/* Step 1: Underlying */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold">1</span>
                Hangi dayanak varlıkta işlem yapmak istiyorsunuz?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {underlyingAssets.slice(0, 15).map(asset => (
                    <button
                        key={asset}
                        onClick={() => setSelectedUnderlying(asset)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all
                        ${selectedUnderlying === asset 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400'}`}
                    >
                        {asset}
                    </button>
                ))}
                {/* Simplified list for UI demo */}
            </div>
            {/* Show dropdown if not selected from quick list */}
            <div className="mt-4">
                 <select 
                    className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    value={selectedUnderlying}
                    onChange={(e) => setSelectedUnderlying(e.target.value)}
                 >
                    <option value="">Diğer Varlıklar...</option>
                    {underlyingAssets.map(asset => (
                        <option key={asset} value={asset}>{asset}</option>
                    ))}
                 </select>
            </div>
        </div>

        {/* Step 2: Direction */}
        <div className={`bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden transition-all duration-300 ${!selectedUnderlying ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
             <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold">2</span>
                Piyasa beklentiniz ne yönde?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={() => setDirection('UP')}
                    className={`flex items-center justify-center gap-4 p-6 rounded-xl border-2 transition-all
                    ${direction === 'UP'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-500'}`}
                >
                    <TrendingUp size={32} />
                    <div className="text-left">
                        <div className="font-bold text-lg">Yükseliş (Alım)</div>
                        <div className="text-sm opacity-80">Hisse fiyatının artacağını düşünüyorum.</div>
                    </div>
                </button>
                <button 
                    onClick={() => setDirection('DOWN')}
                    className={`flex items-center justify-center gap-4 p-6 rounded-xl border-2 transition-all
                    ${direction === 'DOWN'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'border-slate-200 dark:border-slate-700 hover:border-rose-400 text-slate-500'}`}
                >
                    <TrendingDown size={32} />
                    <div className="text-left">
                        <div className="font-bold text-lg">Düşüş (Satım)</div>
                        <div className="text-sm opacity-80">Hisse fiyatının düşeceğini düşünüyorum.</div>
                    </div>
                </button>
            </div>
        </div>

        {/* Step 3: Risk */}
        <div className={`bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden transition-all duration-300 ${!direction ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
             <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
             <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-bold">3</span>
                Risk iştahınız nedir?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <button onClick={() => setRiskProfile('LOW')} className={`p-4 rounded-xl border transition-all text-left group ${riskProfile === 'LOW' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500' : 'border-slate-200 dark:border-slate-700 hover:border-amber-400'}`}>
                    <div className="mb-3 p-2 bg-slate-100 dark:bg-slate-800 w-fit rounded-lg text-slate-500 group-hover:text-amber-500"><Shield size={24}/></div>
                    <div className={`font-bold mb-1 ${riskProfile === 'LOW' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>Düşük Risk</div>
                    <p className="text-xs text-slate-500">Daha düşük kaldıraç, paraya yakın (ITM) varantlar. Fiyat hareketlerine daha az duyarlı ama daha güvenli.</p>
                </button>

                <button onClick={() => setRiskProfile('MEDIUM')} className={`p-4 rounded-xl border transition-all text-left group ${riskProfile === 'MEDIUM' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500' : 'border-slate-200 dark:border-slate-700 hover:border-amber-400'}`}>
                    <div className="mb-3 p-2 bg-slate-100 dark:bg-slate-800 w-fit rounded-lg text-slate-500 group-hover:text-amber-500"><Target size={24}/></div>
                    <div className={`font-bold mb-1 ${riskProfile === 'MEDIUM' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>Dengeli</div>
                    <p className="text-xs text-slate-500">Orta kaldıraç, başabaş (ATM) seviyeler. Getiri potansiyeli ve risk dengeli.</p>
                </button>

                <button onClick={() => setRiskProfile('HIGH')} className={`p-4 rounded-xl border transition-all text-left group ${riskProfile === 'HIGH' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500' : 'border-slate-200 dark:border-slate-700 hover:border-amber-400'}`}>
                    <div className="mb-3 p-2 bg-slate-100 dark:bg-slate-800 w-fit rounded-lg text-slate-500 group-hover:text-amber-500"><Zap size={24}/></div>
                    <div className={`font-bold mb-1 ${riskProfile === 'HIGH' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>Yüksek Risk</div>
                    <p className="text-xs text-slate-500">Yüksek kaldıraç, zararda (OTM) varantlar. Küçük hareketlerde yüksek getiri/götürü potansiyeli.</p>
                </button>
            </div>
        </div>

        {/* Action Button */}
        <div className={`flex justify-center pt-4 transition-all duration-300 ${!riskProfile ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <button 
                onClick={() => setShowResults(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold py-4 px-12 rounded-full shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all flex items-center gap-3"
            >
                <Wand2 size={24} />
                Varantları Bul
                <ArrowRight size={24} />
            </button>
        </div>

    </div>
  );
};

export default WarrantWizard;