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
    <div className="flex h-screen w-screen overflow-hidden bg-[#050609] text-white">
      {/* Global Toast Bildirim Sistemi Portal */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 50, transition: { duration: 0.2 } }}
              className={`bg-[#0D0F16]/90 p-4 rounded-xl border border-white/[0.05] flex items-center justify-between shadow-2xl shadow-black/50 pointer-events-auto backdrop-blur-xl ${
                t.type === 'error' 
                  ? 'border-l-[3px] border-l-rose-500' 
                  : t.type === 'success' 
                    ? 'border-l-[3px] border-l-emerald-500' 
                    : 'border-l-[3px] border-l-amber-500'
              }`}
            >
              <span className="text-[12px] font-semibold text-white tracking-wide pr-3">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer outline-none"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sol: Premium Snappy Sidebar */}
      <Sidebar />

      {/* Sağ: Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050609]">
        {/* İçerik alanı (Global Safe-Zone p-10/12 ile korunmaktadır) */}
        <main className="flex-1 overflow-y-auto scrollbar-none relative px-10 pb-12">
          
          {/* Üst Araç Çubuğu - Sabit */}
          {activeNav !== 'settings' && <TopBar />}
          
          <div className="mt-4">
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
          </div>
        </main>
      </div>

      {/* Detay paneli (overlay) */}
      <GameDetailPanel onLaunch={onLaunchGame} />
    </div>
  );
}
