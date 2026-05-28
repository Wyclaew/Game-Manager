// components/layout/MainLayout.tsx — Ana Düzen Bileşeni
// CSS Grid ile sidebar + content düzenini yönetir, global Toast portalını barındırır

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { GameGrid } from '../games/GameGrid';
import { GameDetailPanel } from '../games/GameDetailPanel';
import { SettingsPanel } from '../settings/SettingsPanel';
import { useGameStore } from '../../stores/useGameStore';
import { X } from 'lucide-react';
import type { Game } from '../../types';

interface MainLayoutProps {
  onLaunchGame: (game: Game) => void;
}

export function MainLayout({ onLaunchGame }: MainLayoutProps) {
  const { activeNav, toasts, removeToast } = useGameStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Global Toast Bildirim Sistemi Portal */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`glass-strong p-3.5 rounded-xl border border-border-strong flex items-center justify-between shadow-premium animate-slide-right pointer-events-auto border-l-4 ${
              t.type === 'error' 
                ? 'border-l-accent-rose' 
                : t.type === 'success' 
                  ? 'border-l-accent-emerald' 
                  : 'border-l-accent-orange'
            }`}
          >
            <span className="text-[11px] font-bold text-text-primary tracking-wide">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-text-muted hover:text-accent-orange transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Sol: Sidebar */}
      <Sidebar />

      {/* Sağ: Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Üst: Araç çubuğu (Ayarlar sayfası dışında gösterilir) */}
        {activeNav !== 'settings' && <TopBar />}

        {/* İçerik alanı */}
        <main className="flex-1 overflow-hidden">
          {activeNav === 'settings' ? (
            <SettingsPanel />
          ) : (
            <GameGrid onLaunchGame={onLaunchGame} />
          )}
        </main>
      </div>

      {/* Detay paneli (overlay) */}
      <GameDetailPanel onLaunch={onLaunchGame} />
    </div>
  );
}
