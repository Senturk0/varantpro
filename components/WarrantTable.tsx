import React from 'react';
import { Warrant, WarrantType } from '../types';
import { ChevronRight, ArrowUp, ArrowDown, Search, Scale, Square, CheckSquare } from 'lucide-react';

interface WarrantTableProps {
  warrants: Warrant[];
  onSelect: (warrant: Warrant) => void;
  compareList: Warrant[];
  onToggleCompare: (warrant: Warrant) => void;
  isCompareMode: boolean;
}

const WarrantTable: React.FC<WarrantTableProps> = ({ warrants, onSelect, compareList, onToggleCompare, isCompareMode }) => {
  if (warrants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <Search size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-700 dark:text-slate-400">Kriterlere uygun varant bulunamadı.</p>
        <p className="text-sm mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
      </div>
    );
  }

  const isSelected = (symbol: string) => compareList.some(w => w.symbol === symbol);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none transition-colors">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
        <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
          <tr>
            {isCompareMode && (
                <th className="px-4 py-4 sticky left-0 bg-slate-50 dark:bg-slate-950 z-10 w-10 text-center transition-colors">
                    <Scale size={14} />
                </th>
            )}
            <th className={`px-4 py-4 sticky ${isCompareMode ? 'left-14' : 'left-0'} bg-slate-50 dark:bg-slate-950 z-10 transition-colors`}>Sembol / İhraççı</th>
            <th className="px-4 py-4">Dayanak</th>
            <th className="px-4 py-4">Tip</th>
            <th className="px-4 py-4 text-right">Fiyat</th>
            <th className="px-4 py-4 text-right">Değişim %</th>
            <th className="px-4 py-4 text-right">Kul. Fiyatı</th>
            <th className="px-4 py-4 text-right">Vade</th>
            <th className="px-4 py-4 text-right">Etkin K.</th>
            <th className="px-4 py-4 text-right">Delta</th>
            <th className="px-4 py-4 text-right">Teta</th>
            <th className="px-4 py-4 text-center">Detay</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {warrants.map((w) => {
            const selected = isSelected(w.symbol);
            return (
                <tr 
                key={w.symbol} 
                className={`transition-colors group cursor-pointer 
                    ${selected 
                        ? 'bg-emerald-50 dark:bg-emerald-900/10' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
                onClick={() => onSelect(w)}
                >
                {isCompareMode && (
                    <td className={`px-4 py-3 sticky left-0 z-10 border-r border-slate-100 dark:border-slate-800/50 text-center transition-colors 
                        ${selected 
                            ? 'bg-emerald-50 dark:bg-slate-900' 
                            : 'bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompare(w);
                        }}
                    >
                        <div className={`transition-colors flex justify-center text-slate-400 hover:text-emerald-500 ${selected ? 'text-emerald-500' : ''}`}>
                             {selected ? <CheckSquare size={20} className="fill-emerald-500/10" /> : <Square size={20} />}
                        </div>
                    </td>
                )}

                <td className={`px-4 py-3 font-medium text-slate-900 dark:text-white sticky ${isCompareMode ? 'left-14' : 'left-0'} z-10 border-r border-slate-100 dark:border-slate-800/50 transition-colors 
                    ${selected 
                        ? 'bg-emerald-50 dark:bg-slate-900' 
                        : 'bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60'}`}>
                    <div className="flex flex-col">
                    <span className={selected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors'}>{w.symbol}</span>
                    <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wide">{w.issuer}</span>
                    </div>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">{w.underlying}</td>
                <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${w.type === 'ALIM' ? 'bg-emerald-100 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
                    {w.type}
                    </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-900 dark:text-white tracking-wide">
                    <span className="bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded">{w.price.toFixed(2)}</span>
                </td>
                <td className={`px-4 py-3 text-right font-mono ${w.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    <div className="flex items-center justify-end gap-1">
                        {w.change >= 0 ? <ArrowUp size={12}/> : <ArrowDown size={12}/>}
                        %{Math.abs(w.change).toFixed(2)}
                    </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">{w.strikePrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-xs text-slate-500 dark:text-slate-400">{w.maturity}</td>
                <td className="px-4 py-3 text-right font-mono text-amber-600 dark:text-yellow-500 font-medium">{w.effectiveLeverage.toFixed(1)}x</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{w.delta.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">{w.theta.toFixed(3)}</td>
                <td className="px-4 py-3 text-center">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(w);
                        }}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 dark:hover:text-white transition"
                    >
                        <ChevronRight size={16} />
                    </button>
                </td>
                </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WarrantTable;