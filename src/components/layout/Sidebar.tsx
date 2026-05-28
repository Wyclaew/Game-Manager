// components/layout/Sidebar.tsx — Sol Navigasyon Çubuğu (Minimap Rail)

import {
  Gamepad2, Library, Monitor, Swords, FolderOpen,
  Heart, Clock, Trophy, Settings,
  RefreshCw,
} from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { SidebarButton } from '../ui/SidebarButton';
import type { NavSection } from '../../types';

interface NavItem {
  id: NavSection;
  label: string;
  icon: typeof Gamepad2;
  count?: number;
  color?: string;
}

export function Sidebar() {
  const { activeNav, setActiveNav, stats, isSyncing, syncMessage } = useGameStore();

  // Kütüphane grubu
  const libraryNav: NavItem[] = [
    { id: 'all', label: 'Tüm Oyunlar', icon: Library, count: stats.totalGames, color: 'var(--color-accent-ember-start)' },
  ];

  // Platformlar grubu
  const platformNav: NavItem[] = [
    { id: 'steam', label: 'Steam', icon: Monitor, count: stats.steamGames, color: '#66c0f4' },
    { id: 'epic', label: 'Epic Games', icon: Swords, count: stats.epicGames, color: '#ffffff' },
    { id: 'custom', label: 'Yerel Eklemeler', icon: FolderOpen, count: stats.customGames, color: '#10b981' },
  ];

  // Koleksiyonlar grubu
  const collectionNav: NavItem[] = [
    { id: 'favorites', label: 'Favoriler', icon: Heart, color: '#f43f5e' },
    { id: 'playing', label: 'Aktif Oynanan', icon: Gamepad2, count: stats.statusCounts.Playing, color: '#f59e0b' },
    { id: 'backlog', label: 'Beklemede', icon: Clock, count: stats.statusCounts.Backlog, color: '#818cf8' },
    { id: 'completed', label: 'Tamamlandı', icon: Trophy, count: stats.statusCounts.Completed, color: '#10b981' },
  ];

  return (
    <aside
      className="flex flex-col h-screen w-60 min-w-60 bg-[rgba(9,10,15,0.85)] border-r border-[rgba(255,255,255,0.04)] py-6 backdrop-blur-xl z-20"
    >
      {/* Logo - Üst Alan */}
      <div className="flex items-center gap-3 px-6 pb-6 border-b border-[rgba(255,255,255,0.04)] w-full mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-rose-600/10 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
        >
          <Gamepad2 size={16} className="text-orange-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-black font-display text-text-bright tracking-wider uppercase leading-none">
            GAME MANAGER
          </span>
          <span className="text-[9px] text-text-secondary font-bold mt-1 tracking-widest leading-none">
            V2.0 STABLE
          </span>
        </div>
      </div>

      {/* Ana Navigasyon Grupları */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 w-full flex flex-col">
        {/* Kütüphane Grubu */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-text-secondary px-3 tracking-widest opacity-60">
            Kütüphane
          </label>
          <nav className="space-y-1">
            {libraryNav.map((item) => (
              <SidebarButton
                key={item.id}
                isActive={activeNav === item.id}
                onClick={() => setActiveNav(item.id)}
                icon={item.icon}
                label={item.label}
                count={item.count}
              />
            ))}
          </nav>
        </div>

        {/* Platformlar Grubu */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-text-secondary px-3 tracking-widest opacity-60">
            Platformlar
          </label>
          <nav className="space-y-1">
            {platformNav.map((item) => (
              <SidebarButton
                key={item.id}
                isActive={activeNav === item.id}
                onClick={() => setActiveNav(item.id)}
                icon={item.icon}
                label={item.label}
                count={item.count}
              />
            ))}
          </nav>
        </div>

        {/* Koleksiyonlar Grubu */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-text-secondary px-3 tracking-widest opacity-60">
            Koleksiyonlar
          </label>
          <nav className="space-y-1">
            {collectionNav.map((item) => (
              <SidebarButton
                key={item.id}
                isActive={activeNav === item.id}
                onClick={() => setActiveNav(item.id)}
                icon={item.icon}
                label={item.label}
                count={item.count}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Alt Bölüm — Senkronizasyon & Ayarlar */}
      <div className="px-4 border-t border-[rgba(255,255,255,0.04)] w-full pt-4 flex flex-col gap-4 mt-auto">
        {/* Senkronizasyon Durumu */}
        {isSyncing && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse">
            <RefreshCw size={13} className="animate-spin text-orange-500 flex-shrink-0" />
            <span className="text-[11px] font-bold text-text-secondary truncate">
              {syncMessage || 'Senkronize ediliyor...'}
            </span>
          </div>
        )}

        {/* Ayarlar Düğmesi */}
        <div className="w-full">
          <SidebarButton
            isActive={activeNav === 'settings'}
            onClick={() => setActiveNav('settings')}
            icon={Settings}
            label="Ayarlar"
          />
        </div>
      </div>
    </aside>
  );
}
