// components/layout/TopBar.tsx — Üst Araç Çubuğu

import { Search, Grid3X3, List, SortAsc, SortDesc, Filter, RefreshCw, Sun, Moon } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import type { SortField } from '../../types';

const navTitles: Record<string, string> = {
  all: 'Tüm Kütüphane',
  steam: 'Steam Games',
  epic: 'Epic Games Store',
  custom: 'Yerel Oyunlar',
  favorites: 'Favori Oyunlar',
  playing: 'Aktif Oynananlar',
  backlog: 'Bekleme Listesi',
  completed: 'Tamamlananlar',
  settings: 'Ayarlar',
};

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
    theme, setTheme,
  } = useGameStore();

  return (
    <header
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-[rgba(9,10,15,0.35)] border-b border-[rgba(255,255,255,0.04)] backdrop-blur-md relative"
    >
      {/* Sol: Başlık ve Oyun Sayacı */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-black font-display text-text-bright tracking-tight">
          {navTitles[activeNav] ?? 'Tüm Kütüphane'}
        </h2>
        
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gradient-to-r from-orange-500/10 to-rose-600/10 border border-orange-500/20 text-orange-500 tracking-wider uppercase"
          >
            {filteredGames.length} Oyun
          </span>
          {isSyncing && (
            <div className="flex items-center justify-center p-1 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
              <RefreshCw size={12} className="animate-spin text-orange-500" />
            </div>
          )}
        </div>
      </div>

      {/* Sağ Grup: Arama ve Segmented Filtreler */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Arama Kutusu - Focus olunca genişleyen pürüzsüz kapsül */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"
          />
          <input
            type="text"
            placeholder="Kütüphanede ara..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-48 focus:w-72 bg-[rgba(9,10,15,0.6)] text-text-bright text-[12px] placeholder-[rgba(255,255,255,0.25)] pl-10 pr-4 py-2.5 rounded-full border border-[rgba(255,255,255,0.04)] focus:border-orange-500/30 outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] focus:shadow-[0_0_15px_rgba(249,115,22,0.1),inset_0_2px_4px_rgba(0,0,0,0.8)] font-medium"
          />
        </div>

        {/* Segmented Control - Sıralama Seçenekleri */}
        <div className="flex items-center bg-[rgba(255,255,255,0.02)] p-1 rounded-xl border border-[rgba(255,255,255,0.04)]">
          {sortOptions.map((opt) => {
            const isSelected = sortField === opt.field;
            return (
              <button
                key={opt.field}
                onClick={() => setSorting(opt.field)}
                className={`relative px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 outline-none ${
                  isSelected 
                    ? 'text-text-bright bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.04)] shadow-sm' 
                    : 'text-text-secondary hover:text-text-bright'
                }`}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 shadow-[0_0_6px_rgba(249,115,22,0.6)]" />
                )}
                {opt.label}
                {isSelected && (
                  sortDirection === 'asc'
                    ? <SortAsc size={11} className="text-orange-500" />
                    : <SortDesc size={11} className="text-orange-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Segmented Control - Kurulu Filtresi */}
        <div className="flex items-center bg-[rgba(255,255,255,0.02)] p-1 rounded-xl border border-[rgba(255,255,255,0.04)]">
          <button
            onClick={() => setFilter('installedOnly', !filters.installedOnly)}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 outline-none ${
              filters.installedOnly 
                ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 shadow-sm' 
                : 'text-text-secondary hover:text-text-bright'
            }`}
          >
            <Filter size={11} />
            Kurulu
          </button>
        </div>

        {/* Görünüm Modu Değiştirici */}
        <div className="flex items-center bg-[rgba(255,255,255,0.02)] p-1 rounded-xl border border-[rgba(255,255,255,0.04)]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer outline-none ${
              viewMode === 'grid' ? 'bg-[rgba(255,255,255,0.04)] text-orange-500' : 'text-text-secondary hover:text-text-bright'
            }`}
          >
            <Grid3X3 size={13} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer outline-none ${
              viewMode === 'list' ? 'bg-[rgba(255,255,255,0.04)] text-orange-500' : 'text-text-secondary hover:text-text-bright'
            }`}
          >
            <List size={13} />
          </button>
        </div>

        {/* Tema Değiştirici */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] text-text-secondary hover:text-orange-500 hover:border-orange-500/20 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 cursor-pointer flex items-center justify-center outline-none"
        >
          {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>
    </header>
  );
}
