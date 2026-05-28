import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label?: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, error, className = '', style, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2 text-left">
        {label && (
          <label className="text-[13px] font-bold tracking-wide text-slate-400 px-1 mb-1">
            {label}
          </label>
        )}

        <div className="relative group w-full">
          {Icon && (
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-200 z-10 pointer-events-none">
              <Icon size={18} />
            </div>
          )}

          <input
            ref={ref}
            className={`w-full bg-[#050608] border border-white/[0.06] rounded-xl py-3.5 text-[15px] text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner ${className}`}
            style={{ 
              paddingLeft: Icon ? '48px' : '20px', 
              paddingRight: '20px',
              ...style 
            }}
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm font-semibold text-rose-500 px-1 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
