import { Search, Grid3X3, List, SortAsc, SortDesc, Filter, RefreshCw } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import type { SortField } from '../../types';

const sortOptions: { field: SortField; label: string }[] = [
  { field: 'title', label: 'İsim' },
  { field: 'playtime', label: 'Süre' },
  { field: 'lastPlayed', label: 'Son Oynama' },
  { field: 'status', label: 'Durum' },
];

export function TopBar() {
  const {
    filters, setFilter,
    sortField, sortDirection, setSorting,
    viewMode, setViewMode,
    activeNav, filteredGames,
    isSyncing,
  } = useGameStore();

  return (
    <header
      className="sticky top-0 z-50 bg-[#050609]/80 backdrop-blur-md border-b border-white/[0.02] py-5 px-10 mb-8 flex items-center justify-between"
    >
      {/* Sol: Başlık ve Oyun Sayacı */}
      <div className="flex items-center gap-5">
        <h2 className="text-2xl font-bold tracking-tight text-white capitalize">
          {activeNav === 'all' ? 'Tüm Kütüphane' : activeNav.replace('-', ' ')}
        </h2>
        
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-bold px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.05] text-slate-400 tracking-widest uppercase">
            {filteredGames.length} OYUN
          </span>
          {isSyncing && (
            <div className="flex items-center justify-center p-1.5 rounded-full bg-cyan-500/10">
              <RefreshCw size={14} className="animate-spin text-cyan-400" />
            </div>
          )}
        </div>
      </div>

      {/* Sağ Grup: Arama ve Sorting Chips */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Geniş Arama Kutusu */}
        <div className="relative">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Kütüphanede ara..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-56 focus:w-80 bg-white/[0.03] text-white text-[14px] placeholder-slate-500 pr-5 py-3 rounded-full border border-white/[0.05] focus:border-cyan-500/50 outline-none transition-all duration-300 shadow-inner"
            style={{ paddingLeft: '44px' }}
          />
        </div>

        {/* Sorting Control Tags (Sleek Capsule Pills) */}
        <div className="flex items-center gap-2">
          {sortOptions.map((opt) => {
            const isSelected = sortField === opt.field;
            return (
              <button
                key={opt.field}
                onClick={() => setSorting(opt.field)}
                className={`flex items-center gap-2 transition-all duration-150 cursor-pointer outline-none ${
                  isSelected 
                    ? 'bg-cyan-500 text-black px-4 py-2 rounded-full text-xs font-bold'
                    : 'bg-white/[0.03] text-slate-400 border border-white/[0.04] px-4 py-2 rounded-full text-xs font-medium hover:text-white hover:border-white/[0.1]'
                }`}
              >
                {opt.label}
                {isSelected && (
                  sortDirection === 'asc'
                    ? <SortAsc size={14} className="text-black" />
                    : <SortDesc size={14} className="text-black" />
                )}
              </button>
            );
          })}
        </div>

        <div className="w-[1px] h-8 bg-white/[0.05] mx-2"></div>

        {/* Görünüm Modu Değiştirici (Pills) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`transition-all duration-150 cursor-pointer outline-none flex items-center justify-center h-8 w-10 rounded-full ${
              viewMode === 'grid' 
                ? 'bg-cyan-500 text-black font-bold' 
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.04] hover:text-white hover:border-white/[0.1]'
            }`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`transition-all duration-150 cursor-pointer outline-none flex items-center justify-center h-8 w-10 rounded-full ${
              viewMode === 'list' 
                ? 'bg-cyan-500 text-black font-bold' 
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.04] hover:text-white hover:border-white/[0.1]'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
