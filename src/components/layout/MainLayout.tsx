// components/layout/MainLayout.tsx — Ana Düzen Bileşeni

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { GameGrid } from '../games/GameGrid';
import { GameDetailPanel } from '../games/GameDetailPanel';
import { SettingsPanel } from '../settings/SettingsPanel';
import { useGameStore } from '../../stores/useGameStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Game } from '../../types';

interface MainLayoutProps {
  onLaunchGame: (game: Game) => void;
}

export function MainLayout({ onLaunchGame }: MainLayoutProps) {
  const { activeNav, toasts, removeToast } = useGameStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Global Toast Bildirim Sistemi Portal */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 50, transition: { duration: 0.2 } }}
              className={`glass-strong p-4 rounded-xl border border-border-strong flex items-center justify-between shadow-premium pointer-events-auto border-l-[3px] backdrop-blur-md ${
                t.type === 'error' 
                  ? 'border-l-accent-rose' 
                  : t.type === 'success' 
                    ? 'border-l-accent-emerald' 
                    : 'border-l-accent-ember-start'
              }`}
            >
              <span className="text-[12px] font-bold text-text-bright tracking-wide pr-3">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="text-text-secondary hover:text-text-bright transition-colors cursor-pointer outline-none"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sol: Sidebar */}
      <Sidebar />

      {/* Sağ: Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(circle_at_center,_var(--border-subtle)_1px,_transparent_1px)] bg-[size:16px_16px]">
        {/* Üst: Araç çubuğu (Ayarlar sayfası dışında gösterilir) */}
        {activeNav !== 'settings' && <TopBar />}

        {/* İçerik alanı */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {activeNav === 'settings' ? (
                <SettingsPanel />
              ) : (
                <GameGrid onLaunchGame={onLaunchGame} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Detay paneli (overlay) */}
      <GameDetailPanel onLaunch={onLaunchGame} />
    </div>
  );
}
