// components/ui/SidebarButton.tsx — Cyber-Minimalist Obsidian Sidebar Düğmesi

import React from 'react';
import { motion } from 'framer-motion';

interface SidebarButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string;
  count?: number;
  badge?: React.ReactNode;
}

export function SidebarButton({
  isActive,
  onClick,
  icon: Icon,
  label,
  count,
  badge
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-start gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group relative cursor-pointer outline-none select-none text-left"
      style={{
        background: isActive ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
        border: isActive ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid transparent',
      }}
    >
      {/* Sol kenarda yer alan Ember gradyan aktiflik çubuğu */}
      {isActive && (
        <motion.div
          layoutId="sidebarActiveBar"
          className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r-full bg-gradient-to-b from-orange-500 to-rose-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      {/* Arka plandaki yumuşak Ember glow ışıltısı */}
      {isActive && (
        <motion.div
          layoutId="sidebarActiveGlow"
          className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-rose-600/5 rounded-xl -z-10 blur-sm"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      {/* İkon */}
      <Icon
        size={16}
        className="flex-shrink-0 transition-all duration-300"
        style={{
          color: isActive 
            ? 'var(--color-text-bright)' 
            : 'var(--color-text-secondary)',
          filter: isActive ? 'drop-shadow(0 0 6px rgba(249,115,22,0.3))' : 'none'
        }}
      />

      {/* Metin Etiketi */}
      <span
        className="text-[12.5px] font-bold transition-colors duration-300 truncate"
        style={{
          color: isActive ? 'var(--color-text-bright)' : 'var(--color-text-secondary)',
        }}
      >
        {label}
      </span>

      {/* Sayaç */}
      {count !== undefined && count > 0 && (
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-text-secondary border border-[rgba(255,255,255,0.03)] group-hover:text-text-bright transition-colors duration-300">
          {count}
        </span>
      )}

      {badge && (
        <div className="absolute top-2 right-2">
          {badge}
        </div>
      )}
    </button>
  );
}
