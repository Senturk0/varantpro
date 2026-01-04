import React from 'react';
import { LayoutDashboard, Wand2, ExternalLink, ChevronLeft, ChevronRight, BarChart3, Globe } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeView: 'dashboard' | 'wizard';
  setActiveView: (view: 'dashboard' | 'wizard') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, activeView, setActiveView }) => {
  return (
    <aside 
      className={`${isOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col fixed left-0 top-0 h-full z-40 shadow-xl shadow-slate-200/50 dark:shadow-none`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 relative">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap px-4 w-full">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20 shrink-0">
                <BarChart3 className="text-white" size={24} />
            </div>
            <div className={`flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                VarantPro
                </span>
            </div>
        </div>
        
        {/* Toggle Button */}
        <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors shadow-sm z-50"
        >
            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        
        <button 
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
            ${activeView === 'dashboard' 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
        >
            <LayoutDashboard size={22} className="shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Piyasa Ekranı
            </span>
            {!isOpen && (
                <div className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                    Piyasa Ekranı
                </div>
            )}
        </button>

        <button 
            onClick={() => setActiveView('wizard')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
            ${activeView === 'wizard' 
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
        >
            <Wand2 size={22} className="shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Varant Sihirbazı
            </span>
            {!isOpen && (
                <div className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                    Varant Sihirbazı
                </div>
            )}
        </button>

      </nav>

      {/* Footer Links */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
        {isOpen && <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kurumlar</div>}
        
        <a href="https://www.isvarant.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-500 hover:text-emerald-500 transition-colors group relative">
            <Globe size={18} className="shrink-0" />
            <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>İş Varant</span>
        </a>
        
        <a href="https://infovarant.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-500 hover:text-emerald-500 transition-colors group relative">
            <Globe size={18} className="shrink-0" />
            <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>İnfo Varant</span>
        </a>

        <a href="https://varant.akyatirim.com.tr" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-500 hover:text-emerald-500 transition-colors group relative">
            <Globe size={18} className="shrink-0" />
            <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Ak Yatırım</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;