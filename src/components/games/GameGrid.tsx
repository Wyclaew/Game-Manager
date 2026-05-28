// components/games/GameGrid.tsx — Sanallaştırılmış Oyun Grid'i
// @tanstack/react-virtual ile binlerce oyun kartını yüksek performansla render eder

import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useGameStore } from '../../stores/useGameStore';
import { GameCard } from './GameCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ActionButton } from '../ui/ActionButton';
import { Gamepad2, Plus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Game } from '../../types';

interface GameGridProps {
  onLaunchGame: (game: Game) => void;
}

// Grid'deki sütun sayısı — pencere genişliğine göre hesaplanır
const GAP = 16;             // kartlar arası boşluk (px)

export function GameGrid({ onLaunchGame }: GameGridProps) {
  const { filteredGames, isLoading, viewMode } = useGameStore();
  const parentRef = useRef<HTMLDivElement>(null);

  // Sütun sayısını hesapla (parent genişliğine göre)
  const columnCount = useMemo(() => {
    if (viewMode === 'list') return 1;
    // Varsayılan: 5 sütun (1440px genişlik için)
    // Bu değer gerçekte resize observer ile dinamik olmalı,
    // ancak başlangıç için sabit değer kullanıyoruz
    return 5;
  }, [viewMode]);

  // Satırları oluştur (her satırda columnCount kadar kart)
  const rows = useMemo(() => {
    const result: Game[][] = [];
    for (let i = 0; i < filteredGames.length; i += columnCount) {
      result.push(filteredGames.slice(i, i + columnCount));
    }
    return result;
  }, [filteredGames, columnCount]);

  // Sanallaştırılmış satırlar
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (viewMode === 'list' ? 84 : 340),
    overscan: 3,
  });

  // Yükleniyor durumu
  if (isLoading) {
    return <LoadingSpinner message="Kütüphane taranıyor..." size="lg" />;
  }

  // Boş Durum (Empty State) Overhaul
  if (filteredGames.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden bg-bg-primary py-20 px-6">
        {/* Derinlik hissi veren merkezcil radial gradyan parıltı */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.06)_0%,_transparent_70%)] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center max-w-sm text-center"
        >
          {/* Buzlu cam çember içinde placeholder ikon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center bg-bg-glass border border-border-medium mb-6 shadow-premium backdrop-blur-md"
          >
            <Gamepad2 size={32} className="text-text-secondary group-hover:text-orange-500 transition-colors duration-300" />
          </div>

          <h3 className="text-lg font-black font-display text-text-bright tracking-tight mb-2 uppercase">
            Kütüphane Bomboş
          </h3>
          <p className="text-xs text-text-secondary font-medium leading-relaxed mb-8">
            Steam veya Epic Games platformlarını bağlayarak kütüphanenizi anında senkronize edebilirsiniz.
          </p>

          {/* Glow Shadow'lu Action Button */}
          <ActionButton
            variant="primary"
            icon={Plus}
            onClick={() => useGameStore.getState().setActiveNav('settings')}
            className="shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
          >
            PLATFORM BAĞLA
          </ActionButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto px-8 py-6 h-full"
    >
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const gamesInRow = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {viewMode === 'grid' ? (
                /* Grid Görünümü */
                <div
                  className="grid gap-4 h-full"
                  style={{
                    gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                    paddingBottom: `${GAP}px`,
                  }}
                >
                  {gamesInRow.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onLaunch={onLaunchGame}
                    />
                  ))}
                </div>
              ) : (
                /* Liste Görünümü */
                <div className="space-y-3 pb-3">
                  {gamesInRow.map((game) => (
                    <ListRow key={game.id} game={game} onLaunch={onLaunchGame} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================
// Liste Satırı Alt Bileşeni - Obsidian Edit
// =============================================
function ListRow({ game, onLaunch }: { game: Game; onLaunch: (g: Game) => void }) {
  const { setSelectedGame } = useGameStore();
  const isInstalled = typeof game.is_installed === 'boolean' ? game.is_installed : game.is_installed === 1;

  return (
    <motion.div
      whileHover={{ scale: 1.005, backgroundColor: 'var(--color-bg-hover)' }}
      className="flex items-center gap-4 px-5 py-3 rounded-xl cursor-pointer bg-bg-secondary border border-border-subtle hover:border-border-medium transition-all duration-300 shadow-sm"
      onClick={() => setSelectedGame(game)}
    >
      {/* Mini kapak */}
      <img
        src={game.cover_image_url ?? ''}
        alt={game.title}
        className="w-10 h-14 object-cover rounded-lg bg-[rgba(9,10,15,0.6)] shadow-inner"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="56"><rect width="40" height="56" fill="%2314161c"/></svg>';
        }}
      />
      {/* Oyun bilgisi */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-text-bright truncate tracking-wide">
          {game.title}
        </h4>
        <p className="text-[10px] text-text-secondary font-semibold mt-1 flex items-center gap-1.5">
          <span>{game.platform_name}</span>
          <span className="w-1 h-1 rounded-full bg-text-muted" />
          {game.total_playtime_minutes > 0 ? (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {Math.round(game.total_playtime_minutes / 60)} saat
            </span>
          ) : (
            <span>Süre Yok</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-bg-hover border border-border-subtle text-text-secondary">
          {game.status}
        </span>
        
        {isInstalled && (
          <ActionButton
            variant="primary"
            className="text-[10px] py-1.5 px-3.5"
            onClick={(e) => { e.stopPropagation(); onLaunch(game); }}
          >
            Oyna
          </ActionButton>
        )}
      </div>
    </motion.div>
  );
}

