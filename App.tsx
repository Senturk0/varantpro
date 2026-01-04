import React, { useState, useEffect, useMemo } from 'react';
import { getWarrants } from './services/mockDataService';
import { Warrant, FilterState } from './types';
import WarrantTable from './components/WarrantTable';
import AnalysisModal from './components/AnalysisModal';
import ComparisonModal from './components/ComparisonModal';
import MarketChart from './components/MarketChart';
import Sidebar from './components/Sidebar';
import WarrantWizard from './components/WarrantWizard';
import { Search, Filter, BarChart3, Info, ExternalLink, Scale, X, ArrowRight, Sun, Moon, CheckSquare, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [warrants, setWarrants] = useState<Warrant[]>([]);
  const [selectedWarrant, setSelectedWarrant] = useState<Warrant | null>(null);
  const [compareList, setCompareList] = useState<Warrant[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'wizard'>('dashboard');
  
  const [filters, setFilters] = useState<FilterState>({
    underlying: 'ALL',
    issuer: 'ALL',
    type: 'ALL',
    search: ''
  });

  // Initialize Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(curr => curr === 'dark' ? 'light' : 'dark');
  };

  // Load initial data
  useEffect(() => {
    const data = getWarrants(); 
    setWarrants(data);
  }, []);

  // Handle Search Input (Clears underlying filter to prioritize search text)
  const handleSearchChange = (val: string) => {
    setFilters(prev => ({
      ...prev,
      search: val,
      underlying: val.length > 0 ? 'ALL' : prev.underlying 
    }));
  };

  // Comparison Logic
  const handleToggleCompare = (warrant: Warrant) => {
    setCompareList(prev => {
      const exists = prev.some(w => w.symbol === warrant.symbol);
      
      if (exists) {
        return prev.filter(w => w.symbol !== warrant.symbol);
      } else {
        if (prev.length >= 5) return prev;
        return [...prev, warrant];
      }
    });
  };

  const removeComparisonItem = (symbol: string) => {
    setCompareList(prev => prev.filter(w => w.symbol !== symbol));
  };

  const clearComparison = () => {
    setCompareList([]);
    setIsCompareMode(false);
  };

  // Compute filtering
  const filteredWarrants = useMemo(() => {
    return warrants.filter(w => {
      const matchUnderlying = filters.underlying === 'ALL' || w.underlying === filters.underlying;
      const matchIssuer = filters.issuer === 'ALL' || w.issuer === filters.issuer;
      const matchType = filters.type === 'ALL' || w.type === filters.type;
      
      const searchLower = filters.search.toLowerCase();
      const matchSearch = w.symbol.toLowerCase().includes(searchLower) || 
                          w.underlying.toLowerCase().includes(searchLower);
      
      return matchUnderlying && matchIssuer && matchType && matchSearch;
    });
  }, [warrants, filters]);

  // Unique values for dropdowns
  const underlyingAssets = Array.from(new Set(warrants.map(w => w.underlying))).sort();
  const issuers = Array.from(new Set(warrants.map(w => w.issuer))).sort();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Header (Top Bar) */}
        <header className="h-16 sticky top-0 z-30 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              {/* Breadcrumb or Title based on View */}
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                {activeView === 'dashboard' ? 'Piyasa Ekranı' : 'Varant Sihirbazı'}
              </h2>
           </div>

           <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-slate-600 dark:text-emerald-400 font-medium">Piyasa Açık</span>
                </div>
                
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
           </div>
        </header>

        {/* View Content */}
        <main className="p-6 pb-32">
            
            {activeView === 'dashboard' ? (
                <>
                    {/* Dashboard Header Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 space-y-4">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BIST 30 Varant Piyasası</h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
                                İş Yatırım, İnfo Yatırım ve Ak Yatırım tarafından ihraç edilen tüm varantların anlık piyasa verileri.
                                "Karşılaştırma Modu"nu açarak birden fazla varantı seçip kıyaslayabilirsiniz.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono">XU100: <span className="text-emerald-600 dark:text-emerald-400 font-bold">9.850 (+0.45%)</span></span>
                                <span className="px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono">XU030: <span className="text-emerald-600 dark:text-emerald-400 font-bold">10.750 (+0.52%)</span></span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden shadow-sm dark:shadow-inner">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Endeks Trendi</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-transparent">Canlı</div>
                            </div>
                            <MarketChart />
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-20 shadow-xl shadow-slate-200/50 dark:shadow-black/40 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 transition-colors">
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div className="relative group w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Dayanak veya Sembol Ara..." 
                                    className="w-full md:w-64 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    value={filters.search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                                <select 
                                    className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    value={filters.underlying}
                                    onChange={(e) => setFilters(prev => ({...prev, underlying: e.target.value}))}
                                >
                                    <option value="ALL">Tüm Dayanaklar</option>
                                    {underlyingAssets.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>

                                <select 
                                    className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    value={filters.type}
                                    onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
                                >
                                    <option value="ALL">Tip</option>
                                    <option value="ALIM">Alım (Call)</option>
                                    <option value="SATIM">Satım (Put)</option>
                                </select>

                                <select 
                                    className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    value={filters.issuer}
                                    onChange={(e) => setFilters(prev => ({...prev, issuer: e.target.value}))}
                                >
                                    <option value="ALL">Tüm Kurumlar</option>
                                    {issuers.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCompareMode(!isCompareMode)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    isCompareMode 
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                <CheckSquare size={16} />
                                {isCompareMode ? 'Karşılaştırma Aktif' : 'Karşılaştırma Modu'}
                            </button>
                        </div>
                    </div>

                    <WarrantTable 
                        warrants={filteredWarrants} 
                        onSelect={setSelectedWarrant}
                        compareList={compareList}
                        onToggleCompare={handleToggleCompare}
                        isCompareMode={isCompareMode}
                    />
                </>
            ) : (
                <WarrantWizard 
                    allWarrants={warrants} 
                    onSelectWarrant={setSelectedWarrant}
                    onCompare={handleToggleCompare}
                    compareList={compareList}
                />
            )}

        </main>

        {/* Floating Comparison Bar */}
        {compareList.length > 0 && (
            <div className={`fixed bottom-6 left-1/2 z-40 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-300 transition-all ${isSidebarOpen ? 'translate-x-16' : 'translate-x-0'}`}>
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-3 flex items-center justify-between gap-4 -translate-x-1/2 ml-[50%]">
                <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-hide flex-1">
                    <div className="flex items-center gap-2 pl-2 border-r border-slate-200 dark:border-slate-700 pr-4 shrink-0">
                        <Scale className="text-emerald-500" size={20} />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{compareList.length} Seçili</span>
                            <span className="text-[10px] text-slate-500 uppercase">Karşılaştırma</span>
                        </div>
                    </div>
                    {compareList.map(w => (
                        <div key={w.symbol} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-300">{w.symbol}</span>
                            <button onClick={() => removeComparisonItem(w.symbol)} className="text-slate-400 hover:text-rose-500 transition">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                    <button 
                        onClick={clearComparison}
                        className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                    >
                        Temizle
                    </button>
                    <button 
                        onClick={() => setShowComparison(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                        Kıyasla <ArrowRight size={16} />
                    </button>
                </div>
            </div>
            </div>
        )}

      </div>

      {/* Modals */}
      {selectedWarrant && (
        <AnalysisModal 
            warrant={selectedWarrant} 
            onClose={() => setSelectedWarrant(null)} 
        />
      )}

      {showComparison && (
        <ComparisonModal 
            warrants={compareList} 
            onClose={() => setShowComparison(false)}
            onRemove={removeComparisonItem}
        />
      )}
    </div>
  );
};

export default App;