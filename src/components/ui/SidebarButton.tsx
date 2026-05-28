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
      className="w-full flex items-center justify-center p-3.5 rounded-xl transition-all duration-300 group relative cursor-pointer outline-none"
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
        size={18}
        className="flex-shrink-0 transition-all duration-300"
        style={{
          color: isActive 
            ? 'var(--color-text-bright)' 
            : 'var(--color-text-muted)',
          filter: isActive ? 'drop-shadow(0 0 6px rgba(249,115,22,0.3))' : 'none'
        }}
      />

      {badge && (
        <div className="absolute top-2 right-2">
          {badge}
        </div>
      )}

      {/* Hover Tooltip */}
      <div className="absolute left-[84px] bg-[rgba(13,14,18,0.95)] border border-[rgba(255,255,255,0.08)] text-[11px] font-bold py-2 px-3.5 rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-premium z-50 whitespace-nowrap text-text-bright flex items-center gap-2 backdrop-blur-md">
        <span>{label}</span>
        {count !== undefined && count > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-text-muted font-sans font-medium">
            {count}
          </span>
        )}
      </div>
    </button>
  );
}
