// components/games/GameDetailPanel.tsx — Oyun Detay Paneli (Premium Slide-Over)
// Sağdan kayan cam paneli: banner, istatistikler, asimetrik PLAY butonu, kiremit turuncu vurgular

import { useState } from 'react';
import {
  X, Play, Heart, Clock, Calendar, HardDrive,
  Download, Monitor, Swords, FolderOpen,
  ChevronDown, ExternalLink,
} from 'lucide-react';
import { useGameStore, formatPlaytime } from '../../stores/useGameStore';
import { GameStatusBadge } from './GameStatusBadge';
import { ActionButton } from '../ui/ActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import type { Game, GameStatus, PlatformName } from '../../types';

interface GameDetailPanelProps {
  onLaunch: (game: Game) => void;
}

const allStatuses: GameStatus[] = ['Backlog', 'Playing', 'Completed', 'Wishlist', 'Dropped'];

const statusLabels: Record<GameStatus, string> = {
  Backlog: 'Beklemede',
  Playing: 'Oynuyor',
  Completed: 'Tamamlandı',
  Wishlist: 'İstek Listesi',
  Dropped: 'Bırakıldı',
};

const platformIcons: Record<PlatformName, typeof Monitor> = {
  Steam: Monitor,
  Epic: Swords,
  Custom: FolderOpen,
};

export function GameDetailPanel({ onLaunch }: GameDetailPanelProps) {
  const { selectedGame, isDetailOpen, toggleDetail, updateGameStatus, toggleFavorite, addToast } = useGameStore();
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  if (!selectedGame) return null;

  const game = selectedGame;
  const isInstalled = typeof game.is_installed === 'boolean' ? game.is_installed : game.is_installed === 1;
  const isFavorite = typeof game.is_favorite === 'boolean' ? game.is_favorite : game.is_favorite === 1;
  const PlatformIcon = platformIcons[game.platform_name] ?? FolderOpen;

  // Son oynama tarihini formatla
  const formatLastPlayed = (dateStr: string | null): string => {
    if (!dateStr) return 'Hiç oynanmadı';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Bugün';
      if (diffDays === 1) return 'Dün';
      if (diffDays < 7) return `${diffDays} gün önce`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
      return `${Math.floor(diffDays / 365)} yıl önce`;
    } catch {
      return 'Bilinmiyor';
    }
  };

  return (
    <AnimatePresence>
      {isDetailOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px]"
            onClick={() => toggleDetail(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col glass-strong border-l border-[rgba(255,255,255,0.06)] shadow-premium w-[450px] max-w-full overflow-hidden"
          >
            {/* Banner Görseli */}
            <div className="relative h-56 flex-shrink-0 overflow-hidden select-none">
              <img
                src={game.banner_image_url ?? game.cover_image_url ?? ''}
                alt={game.title}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.5)' }}
              />
              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#090a0f] to-transparent"
              />

              {/* Kapat Butonu */}
              <button
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 border border-white/5 text-text-primary hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer outline-none"
                onClick={() => toggleDetail(false)}
              >
                <X size={14} />
              </button>

              {/* Favori Butonu */}
              <button
                className={`absolute top-4 left-4 p-2.5 rounded-xl border backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer outline-none ${
                  isFavorite 
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-500' 
                    : 'bg-black/40 border-white/5 text-white'
                }`}
                onClick={async () => {
                  await toggleFavorite(game.id);
                  addToast(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi', 'success');
                }}
              >
                <Heart
                  size={13}
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              </button>

              {/* Başlık Overlay */}
              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <PlatformIcon size={12} className="text-text-secondary" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">
                    {game.platform_name}
                  </span>
                </div>
                <h2
                  className="text-lg font-black font-display text-text-bright leading-tight tracking-wide"
                >
                  {game.title}
                </h2>
              </div>
            </div>

            {/* İçerik */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

              {/* Oynat / İndir Düğmesi */}
              <ActionButton
                variant="primary"
                className="w-full py-4 tracking-widest uppercase text-[11px] shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                onClick={() => {
                  if (isInstalled) {
                    onLaunch(game);
                  } else {
                    addToast('Oyun kurulu değil. Lütfen önce kurulum yolunu tanımlayın.', 'info');
                  }
                }}
              >
                {isInstalled ? (
                  <>
                    <Play size={13} fill="white" className="text-white" />
                    OYUNU BAŞLAT
                  </>
                ) : (
                  <>
                    <Download size={13} />
                    YÜKLENMEMİŞ
                  </>
                )}
              </ActionButton>

              {/* İstatistikler */}
              <div className="grid grid-cols-2 gap-4">
                {/* Süre */}
                <div className="rounded-2xl p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock size={12} className="text-orange-500" />
                    <span className="text-[9px] font-black tracking-wider uppercase text-text-secondary">Toplam Süre</span>
                  </div>
                  <p className="text-base font-bold font-display text-text-bright">
                    {formatPlaytime(game.total_playtime_minutes)}
                  </p>
                </div>

                {/* Son Oynama */}
                <div className="rounded-2xl p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar size={12} className="text-rose-500" />
                    <span className="text-[9px] font-black tracking-wider uppercase text-text-secondary">Son Oynama</span>
                  </div>
                  <p className="text-xs font-bold text-text-bright mt-0.5">
                    {formatLastPlayed(game.last_played_at)}
                  </p>
                </div>
              </div>

              {/* Durum Değiştirici */}
              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-wider uppercase text-text-secondary">
                  OYUN DURUMU
                </label>
                <div className="relative">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[rgba(9,10,15,0.6)] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-200 cursor-pointer outline-none"
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  >
                    <GameStatusBadge status={game.status as GameStatus} size="md" />
                    <ChevronDown
                      size={14}
                      className="text-text-secondary transition-transform duration-200"
                      style={{
                        transform: statusDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {statusDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50 glass-strong border border-[rgba(255,255,255,0.08)] shadow-premium"
                      >
                        {allStatuses.map((status) => {
                          const isSelected = game.status === status;
                          return (
                            <button
                              key={status}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 cursor-pointer outline-none ${
                                isSelected ? 'bg-[rgba(255,255,255,0.04)] text-orange-500 font-semibold' : 'text-text-primary hover:bg-[rgba(255,255,255,0.02)]'
                              }`}
                              onClick={async () => {
                                await updateGameStatus(game.id, status);
                                setStatusDropdownOpen(false);
                                addToast(`Oyun durumu "${statusLabels[status]}" olarak güncellendi`, 'success');
                              }}
                            >
                              <GameStatusBadge status={status} size="sm" />
                              <span className="text-xs font-semibold">{statusLabels[status]}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Kurulum Yolu */}
              {game.install_path && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black tracking-wider uppercase text-text-secondary">
                    KURULUM DİZİNİ
                  </label>
                  <div
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[rgba(9,10,15,0.6)] border border-[rgba(255,255,255,0.04)]"
                  >
                    <HardDrive size={12} className="text-text-secondary" />
                    <span className="text-xs truncate flex-1 font-semibold text-text-secondary select-all" title={game.install_path}>
                      {game.install_path}
                    </span>
                  </div>
                </div>
              )}

              {/* Oyun ID Bilgisi */}
              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-wider uppercase text-text-secondary">
                  OYUN KİMLİĞİ
                </label>
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[rgba(9,10,15,0.6)] border border-[rgba(255,255,255,0.04)]"
                >
                  <ExternalLink size={12} className="text-text-secondary" />
                  <span className="text-xs font-mono font-bold text-text-secondary select-all">
                    {game.platform_name === 'Steam' ? `AppID: ${game.external_game_id}` : game.external_game_id}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
