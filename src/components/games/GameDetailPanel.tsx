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

  if (!selectedGame || !isDetailOpen) return null;

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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300 bg-black/50 backdrop-blur-[5px]"
        onClick={() => toggleDetail(false)}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col animate-slide-right glass-strong border-l border-border-strong shadow-premium"
        style={{
          width: '450px',
          maxWidth: '100vw',
        }}
      >
        {/* Banner görseli */}
        <div className="relative h-56 flex-shrink-0 overflow-hidden select-none">
          <img
            src={game.banner_image_url ?? game.cover_image_url ?? ''}
            alt={game.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-bg-primary to-transparent"
          />

          {/* Kapat butonu */}
          <button
            className="absolute top-4 right-4 p-2 rounded-xl glass border border-border-subtle text-text-primary hover:text-accent-orange hover:scale-105 hover:border-border-strong transition-all duration-200 cursor-pointer"
            onClick={() => toggleDetail(false)}
          >
            <X size={15} />
          </button>

          {/* Favori butonu */}
          <button
            className={`absolute top-4 left-4 p-2 rounded-xl glass border transition-all duration-200 hover:scale-105 cursor-pointer ${
              isFavorite ? 'bg-rose-500/20 border-rose-500/40 text-rose-500' : 'border-border-subtle text-white'
            }`}
            onClick={async () => {
              await toggleFavorite(game.id);
              addToast(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi', 'success');
            }}
          >
            <Heart
              size={15}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>

          {/* Başlık overlay */}
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-1.5">
              <PlatformIcon size={12} className="text-text-secondary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-text-secondary">
                {game.platform_name}
              </span>
            </div>
            <h2
              className="text-xl font-bold font-display text-text-bright leading-tight"
            >
              {game.title}
            </h2>
          </div>
        </div>

        {/* İçerik — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* OYNA / YÜKLENMEMİŞ butonu */}
          <button
            className={`w-full py-3.5 rounded-xl font-bold font-display text-xs tracking-widest flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-white shadow-premium ${
              isInstalled
                ? 'bg-gradient-to-r from-accent-orange to-accent-orange-hover hover:shadow-[0_8px_25px_var(--accent-orange-glow)] border border-accent-orange/30'
                : 'bg-gradient-to-r from-accent-teal to-accent-teal-glow hover:shadow-[0_8px_25px_var(--accent-teal-glow)] border border-accent-teal/30'
            }`}
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
                <Play size={14} fill="white" />
                OYUNU BAŞLAT
              </>
            ) : (
              <>
                <Download size={14} />
                YÜKLENMEMİŞ
              </>
            )}
          </button>

          {/* İstatistik kartları */}
          <div className="grid grid-cols-2 gap-4">
            {/* Toplam süre */}
            <div className="rounded-2xl p-4 glass border border-border-subtle hover:border-border-strong transition-all duration-300">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock size={13} className="text-accent-orange" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-text-muted">Toplam Süre</span>
              </div>
              <p className="text-lg font-bold font-display text-text-bright">
                {formatPlaytime(game.total_playtime_minutes)}
              </p>
            </div>

            {/* Son oynama */}
            <div className="rounded-2xl p-4 glass border border-border-subtle hover:border-border-strong transition-all duration-300">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar size={13} className="text-accent-teal" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-text-muted">Son Oynama</span>
              </div>
              <p className="text-xs font-semibold text-text-bright mt-0.5">
                {formatLastPlayed(game.last_played_at)}
              </p>
            </div>
          </div>

          {/* Durum değiştirici */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider uppercase text-text-muted">
              OYUN DURUMU
            </label>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-bg-tertiary border border-border-subtle hover:border-border-strong hover:bg-bg-hover transition-all duration-200 cursor-pointer"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              >
                <GameStatusBadge status={game.status as GameStatus} size="md" />
                <ChevronDown
                  size={15}
                  className="text-text-muted transition-transform duration-200"
                  style={{
                    transform: statusDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </button>

              {/* Dropdown menü */}
              {statusDropdownOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-10 animate-scale-in glass-strong border border-border-strong shadow-premium"
                >
                  {allStatuses.map((status) => {
                    const isSelected = game.status === status;
                    return (
                      <button
                        key={status}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 cursor-pointer ${
                          isSelected ? 'bg-bg-hover text-accent-orange font-semibold' : 'text-text-primary hover:bg-bg-tertiary/60'
                        }`}
                        onClick={async () => {
                          await updateGameStatus(game.id, status);
                          setStatusDropdownOpen(false);
                          addToast(`Oyun durumu "${statusLabels[status]}" olarak güncellendi`, 'success');
                        }}
                      >
                        <GameStatusBadge status={status} size="sm" />
                        <span className="text-xs font-medium">{statusLabels[status]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Kurulum dizini */}
          {game.install_path && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider uppercase text-text-muted">
                KURULUM DİZİNİ
              </label>
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-bg-tertiary border border-border-subtle"
              >
                <HardDrive size={13} className="text-text-muted" />
                <span className="text-xs truncate flex-1 font-medium text-text-secondary select-all" title={game.install_path}>
                  {game.install_path}
                </span>
              </div>
            </div>
          )}

          {/* Oyun ID bilgisi */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wider uppercase text-text-muted">
              OYUN KİMLİĞİ
            </label>
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-bg-tertiary border border-border-subtle"
            >
              <ExternalLink size={13} className="text-text-muted" />
              <span className="text-xs font-mono font-medium text-text-secondary select-all">
                {game.platform_name === 'Steam' ? `AppID: ${game.external_game_id}` : game.external_game_id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
