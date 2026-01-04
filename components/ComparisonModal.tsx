import React from 'react';
import { Warrant } from '../types';
import { X, TrendingUp, AlertTriangle } from 'lucide-react';

interface ComparisonModalProps {
  warrants: Warrant[];
  onClose: () => void;
  onRemove: (symbol: string) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ warrants, onClose, onRemove }) => {
  if (warrants.length === 0) return null;

  const metrics = [
    { label: 'Tip', key: 'type', format: (v: any) => v },
    { label: 'Vade', key: 'maturity', format: (v: any) => v },
    { label: 'Fiyat', key: 'price', format: (v: any) => `${v} TL` },
    { label: 'Kul. Fiyatı', key: 'strikePrice', format: (v: any) => v },
    { label: 'Çarpan', key: 'conversionRatio', format: (v: any) => v },
    { label: 'Etkin Kaldıraç', key: 'effectiveLeverage', format: (v: any) => `${v}x`, highlight: true },
    { label: 'Delta', key: 'delta', format: (v: any) => v },
    { label: 'Teta (Günlük)', key: 'theta', format: (v: any) => v },
    { label: 'Başabaş', key: 'breakEven', format: (v: any) => v },
    { label: 'Durum', key: 'status', format: (v: any) => v },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] transition-colors">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900 p-5 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 rounded-t-2xl">
          <div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-emerald-500" size={24} />
                Varant Karşılaştırma
             </h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{warrants[0].underlying} dayanak varlığı için {warrants.length} varant kıyaslanıyor.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-auto p-6 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800 min-w-[150px]">
                    Parametre
                </th>
                {warrants.map(w => (
                  <th key={w.symbol} className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 min-w-[180px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{w.symbol}</div>
                            <div className="text-xs text-slate-500">{w.issuer}</div>
                        </div>
                        <button 
                            onClick={() => onRemove(w.symbol)}
                            className="text-slate-400 hover:text-rose-500 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
                {metrics.map((metric, idx) => (
                    <tr key={metric.key} className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/20' : 'transparent'}>
                        <td className="p-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 font-medium">
                            {metric.label}
                        </td>
                        {warrants.map(w => (
                            <td key={`${w.symbol}-${metric.key}`} className="p-4 border-b border-slate-100 dark:border-slate-800/50 text-slate-800 dark:text-slate-200 font-mono">
                                <span className={metric.highlight ? 'text-amber-600 dark:text-yellow-500 font-bold' : ''}>
                                    {metric.format((w as any)[metric.key])}
                                </span>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
          </table>
          
          <div className="mt-6 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg text-xs text-blue-700 dark:text-blue-200/70">
            <AlertTriangle size={14} />
            <p>
                Kıyaslama tablosundaki veriler anlık piyasa koşullarına göre değişiklik gösterebilir. 
                Yatırım kararı vermeden önce ihraççı kurumun resmi verilerini kontrol ediniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;