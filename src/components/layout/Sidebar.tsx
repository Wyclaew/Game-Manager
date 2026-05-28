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
  const { activeNav, setActiveNav, stats, isSyncing } = useGameStore();

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
      className="flex flex-col h-screen w-20 min-w-20 bg-[rgba(9,10,15,0.85)] border-r border-[rgba(255,255,255,0.04)] items-center py-6 backdrop-blur-xl z-20"
    >
      {/* Logo - Üst Alan */}
      <div className="flex items-center justify-center pb-6 border-b border-[rgba(255,255,255,0.04)] w-full mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-rose-600/10 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)] group cursor-pointer"
        >
          <Gamepad2 size={18} className="text-orange-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      {/* Ana Navigasyon Grupları */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5 w-full flex flex-col items-center">
        {/* Kütüphane */}
        <nav className="w-full space-y-1">
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

        {/* İnce Ayırıcı */}
        <div className="w-10 h-px bg-[rgba(255,255,255,0.04)]" />

        {/* Platformlar */}
        <nav className="w-full space-y-1">
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

        {/* İnce Ayırıcı */}
        <div className="w-10 h-px bg-[rgba(255,255,255,0.04)]" />

        {/* Koleksiyonlar / Durumlar */}
        <nav className="w-full space-y-1">
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

      {/* Alt Bölüm — Senkronizasyon, İstatistikler & Ayarlar */}
      <div className="px-3 border-t border-[rgba(255,255,255,0.04)] w-full pt-5 flex flex-col items-center gap-5 mt-auto">
        {/* Senkronizasyon Durumu */}
        {isSyncing && (
          <div className="relative group p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] animate-pulse">
            <RefreshCw size={15} className="animate-spin text-orange-500" />
            <div className="absolute left-[84px] bg-[rgba(13,14,18,0.95)] border border-[rgba(255,255,255,0.08)] text-[11px] font-bold py-2 px-3.5 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-premium z-50 whitespace-nowrap text-text-bright">
              Kütüphane Eşzamanlanıyor...
            </div>
          </div>
        )}

        {/* Alt İstatistikler */}
        <div className="flex flex-col items-center gap-2.5">
          {/* Toplam Süre İstatistiği */}
          <div className="relative group p-3 rounded-xl bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.08)] transition-all duration-300 cursor-default">
            <Clock size={16} className="text-emerald-500" />
            <div className="absolute left-[84px] top-1/2 -translate-y-1/2 bg-[rgba(13,14,18,0.95)] border border-[rgba(255,255,255,0.08)] text-[11px] font-bold py-2 px-3.5 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-premium z-50 whitespace-nowrap text-text-bright">
              Oynama Süresi: {stats.totalPlaytimeHours} Saat
            </div>
          </div>
        </div>

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
