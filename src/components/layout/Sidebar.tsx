// components/layout/Sidebar.tsx — Sol Navigasyon Çubuğu (Minimap Sidebar)
// Minimal dikey çapa stili (64px genişlik), sadece ikonlar ve hover tooltipler

import {
  Gamepad2, Library, Monitor, Swords, FolderOpen,
  Heart, Clock, Trophy, Settings,
  RefreshCw,
} from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import type { NavSection } from '../../types';

// Navigasyon öğesi yapılandırması
interface NavItem {
  id: NavSection;
  label: string;
  icon: typeof Gamepad2;
  count?: number;
  color?: string;
}

export function Sidebar() {
  const { activeNav, setActiveNav, stats, isSyncing } = useGameStore();

  // Ana navigasyon öğeleri
  const mainNav: NavItem[] = [
    { id: 'all', label: 'Tüm Oyunlar', icon: Library, count: stats.totalGames, color: 'var(--color-accent-orange)' },
  ];

  // Platform navigasyonu
  const platformNav: NavItem[] = [
    { id: 'steam', label: 'Steam', icon: Monitor, count: stats.steamGames, color: '#66c0f4' },
    { id: 'epic', label: 'Epic Games', icon: Swords, count: stats.epicGames, color: '#ffffff' },
    { id: 'custom', label: 'Manuel', icon: FolderOpen, count: stats.customGames, color: '#a855f7' },
  ];

  // Koleksiyon navigasyonu
  const collectionNav: NavItem[] = [
    { id: 'favorites', label: 'Favoriler', icon: Heart, color: '#f43f5e' },
    { id: 'playing', label: 'Oynuyor', icon: Gamepad2, count: stats.statusCounts.Playing, color: '#f59e0b' },
    { id: 'backlog', label: 'Beklemede', icon: Clock, count: stats.statusCounts.Backlog, color: '#818cf8' },
    { id: 'completed', label: 'Tamamlandı', icon: Trophy, count: stats.statusCounts.Completed, color: '#10b981' },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = activeNav === item.id;
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        onClick={() => setActiveNav(item.id)}
        className="w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 group relative cursor-pointer"
        style={{
          background: isActive ? 'var(--color-bg-elevated)' : 'transparent',
          border: isActive ? '1px solid var(--color-border-medium)' : '1px solid transparent',
        }}
      >
        {/* Aktiflik göstergesi — küçük sol bar */}
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
            style={{ background: item.color ?? 'var(--color-accent-orange)' }}
          />
        )}

        <Icon
          size={16}
          style={{ color: isActive ? (item.color ?? 'var(--color-accent-orange)') : 'var(--color-text-secondary)' }}
          className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        />

        {/* Hover Tooltip */}
        <div className="absolute left-[72px] bg-bg-elevated border border-border-strong text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-premium z-50 whitespace-nowrap text-text-bright flex items-center gap-2">
          <span>{item.label}</span>
          {item.count !== undefined && item.count > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted font-sans font-medium">
              {item.count}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <aside
      className="flex flex-col h-screen border-r w-[64px] min-w-[64px] bg-bg-secondary border-border-subtle items-center"
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-5 border-b border-border-subtle w-full mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-accent-orange to-accent-orange-hover shadow-[0_4px_15px_var(--accent-orange-glow)]"
        >
          <Gamepad2 size={16} className="text-white" />
        </div>
      </div>

      {/* Navigasyon İçeriği */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 w-full flex flex-col items-center">
        {/* Ana */}
        <nav className="w-full space-y-1">
          {mainNav.map(renderNavItem)}
        </nav>

        {/* Ayırıcı */}
        <div className="w-8 h-px bg-border-subtle" />

        {/* Platformlar */}
        <nav className="w-full space-y-1">
          {platformNav.map(renderNavItem)}
        </nav>

        {/* Ayırıcı */}
        <div className="w-8 h-px bg-border-subtle" />

        {/* Koleksiyonlar */}
        <nav className="w-full space-y-1">
          {collectionNav.map(renderNavItem)}
        </nav>
      </div>

      {/* Alt Bilgi — İstatistikler & Ayarlar */}
      <div className="px-2 py-4 border-t border-border-subtle w-full flex flex-col items-center gap-4">
        {/* Senkronizasyon durumu */}
        {isSyncing && (
          <div className="relative group p-2 rounded-xl bg-bg-tertiary border border-border-subtle animate-pulse">
            <RefreshCw size={14} className="animate-spin text-accent-orange" />
            <div className="absolute left-[72px] bg-bg-elevated border border-border-strong text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-premium z-50 whitespace-nowrap text-text-bright">
              Eşzamanlanıyor...
            </div>
          </div>
        )}

        {/* İstatistikler */}
        <div className="flex flex-col items-center gap-2">
          {/* Toplam Oyun */}
          <div className="relative group p-2 rounded-xl bg-bg-tertiary border border-border-subtle hover:border-border-strong transition-all duration-300 cursor-default">
            <Library size={15} className="text-accent-orange" />
            <div className="absolute left-[72px] top-1/2 -translate-y-1/2 bg-bg-elevated border border-border-strong text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-premium z-50 whitespace-nowrap text-text-bright">
              Toplam: {stats.totalGames} Oyun
            </div>
          </div>
          
          {/* Süre */}
          <div className="relative group p-2 rounded-xl bg-bg-tertiary border border-border-subtle hover:border-border-strong transition-all duration-300 cursor-default">
            <Clock size={15} className="text-accent-teal" />
            <div className="absolute left-[72px] top-1/2 -translate-y-1/2 bg-bg-elevated border border-border-strong text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-premium z-50 whitespace-nowrap text-text-bright">
              Toplam Süre: {stats.totalPlaytimeHours} Saat
            </div>
          </div>
        </div>

        {/* Ayarlar butonu */}
        <button
          onClick={() => setActiveNav('settings')}
          className={`relative group flex items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer ${
            activeNav === 'settings' 
              ? 'bg-bg-elevated text-text-bright border border-border-medium' 
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-transparent'
          }`}
        >
          <Settings size={15} />
          <div className="absolute left-[72px] bg-bg-elevated border border-border-strong text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-premium z-50 whitespace-nowrap text-text-bright">
            Ayarlar
          </div>
        </button>
      </div>
    </aside>
  );
}
