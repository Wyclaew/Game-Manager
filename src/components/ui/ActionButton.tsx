import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface ActionButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  loading?: boolean;
  children?: React.ReactNode;
}

export function ActionButton({
  variant = 'primary',
  icon: Icon,
  loading = false,
  children,
  className = '',
  ...props
}: ActionButtonProps) {
  // Endüstriyel Premium High-Contrast Stilleri
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        // Ana Aksiyonlar (Save/Primary): Beyaz, kalın ve premium
        return 'bg-white text-black font-semibold hover:bg-neutral-200 active:scale-[0.98] border border-transparent';
      case 'secondary':
        // İkincil Aksiyonlar: Obsidian şeffaf
        return 'bg-white/[0.03] text-white font-medium border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] active:scale-[0.98]';
      case 'danger':
        return 'bg-[#0D0F16] hover:bg-rose-950/40 text-rose-400 font-medium border border-white/[0.05] hover:border-rose-500/40 active:scale-[0.98]';
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl tracking-wide text-[15px] transition-all duration-150 ease-out cursor-pointer outline-none ${getVariantStyles()} ${
        loading ? 'opacity-60 pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      
      <span>{children}</span>
    </motion.button>
  );
}
