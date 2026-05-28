// components/games/GameCard.tsx — Oyun Kartı Bileşeni

import { useState } from 'react';
import { Play, Heart, Monitor, Swords, FolderOpen, Clock, Download, Gamepad2 } from 'lucide-react';
import { useGameStore, formatPlaytime } from '../../stores/useGameStore';
import { GameStatusBadge } from './GameStatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import type { Game, PlatformName, GameStatus } from '../../types';

interface GameCardProps {
  game: Game;
  onLaunch: (game: Game) => void;
}

const platformIcons: Record<PlatformName, typeof Monitor> = {
  Steam: Monitor,
  Epic: Swords,
  Custom: FolderOpen,
};

const platformColorClasses: Record<PlatformName, string> = {
  Steam: 'text-sky-400',
  Epic: 'text-text-bright',
  Custom: 'text-orange-500',
};

export function GameCard({ game, onLaunch }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { setSelectedGame, toggleFavorite } = useGameStore();

  const PlatformIcon = platformIcons[game.platform_name] ?? FolderOpen;
  const platformColorClass = platformColorClasses[game.platform_name] ?? 'text-text-secondary';
  const isInstalled = typeof game.is_installed === 'boolean' ? game.is_installed : game.is_installed === 1;
  const isFavorite = typeof game.is_favorite === 'boolean' ? game.is_favorite : game.is_favorite === 1;
  const hasCover = !imgError && game.cover_image_url;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -6, 
        scale: 1.015,
        borderColor: 'rgba(249, 115, 22, 0.3)',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 25px rgba(249, 115, 22, 0.1)'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative rounded-2xl overflow-hidden cursor-pointer bg-[rgba(20,22,28,0.6)] border border-[rgba(255,255,255,0.04)] aspect-[2/3] select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedGame(game)}
    >
      {/* Kapak Görseli veya Placeholder */}
      {!hasCover ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[rgba(255,255,255,0.01)] via-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] p-4 text-orange-500">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <Gamepad2 size={22} className="text-orange-500 animate-pulse" />
          </div>
          <span className="text-xs font-bold px-2 text-center text-text-secondary line-clamp-2 font-display uppercase tracking-wide">
            {game.title}
          </span>
        </div>
      ) : (
        <img
          src={game.cover_image_url || undefined}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      )}

      {/* Cyber-Minimalist Tel Kafes Deseni */}
      <div
        className={`absolute inset-0 wireframe-pattern transition-opacity duration-700 pointer-events-none ${
          isHovered ? 'opacity-30' : 'opacity-0'
        }`}
      />

      {/* Üst-sol: Platform İkonu */}
      <div
        className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-xl glass text-[10px] font-bold border border-[rgba(255,255,255,0.05)] backdrop-blur-md"
      >
        <PlatformIcon size={11} className={platformColorClass} />
        <span className="text-text-secondary tracking-wide">{game.platform_name}</span>
      </div>

      {/* Üst-sağ: Favori Butonu */}
      <button
        className={`absolute top-3.5 right-3.5 p-2.5 rounded-xl transition-all duration-300 border backdrop-blur-md ${
          isFavorite 
            ? 'bg-rose-500/15 border-rose-500/30 text-rose-500 opacity-100 scale-100' 
            : 'bg-black/40 border-white/5 text-white/70 hover:text-white hover:bg-black/60 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 cursor-pointer outline-none'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(game.id);
        }}
        title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      >
        <Heart
          size={12}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>

      {/* Alt Altlık - Bilgiler */}
      <div
        className="absolute inset-x-0 bottom-0 p-4 pt-16 bg-gradient-to-t from-[#090a0f]/95 via-[#090a0f]/70 to-transparent flex flex-col justify-end min-h-[100px] z-10"
      >
        <h3
          className="text-[13px] font-bold font-display text-text-bright truncate mb-1"
          title={game.title}
        >
          {game.title}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-text-secondary">
            {game.total_playtime_minutes > 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-medium">
                <Clock size={11} className="text-text-muted" />
                {formatPlaytime(game.total_playtime_minutes)}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-text-muted">Süre Yok</span>
            )}
          </div>
          <GameStatusBadge status={game.status as GameStatus} size="sm" />
        </div>
      </div>

      {/* Hover Eylem Katmanı */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px] flex items-center justify-center z-20"
          >
            <motion.button
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-display text-[11px] tracking-wider transition-all duration-300 cursor-pointer border outline-none ${
                isInstalled
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 border-orange-500/20 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]'
                  : 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.1)] text-text-bright'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isInstalled) {
                  onLaunch(game);
                } else {
                  setSelectedGame(game);
                }
              }}
            >
              {isInstalled ? (
                <>
                  <Play size={12} fill="white" className="text-white" />
                  BAŞLAT
                </>
              ) : (
                <>
                  <Download size={12} />
                  DETAYLAR
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
