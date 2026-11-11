import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', icon, children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-[#64B58A] text-[#101513] hover:bg-[#64B58A]/90 font-semibold border-transparent shadow-sm',
      secondary: 'bg-[#1B231E] hover:bg-[#202A24] text-[#F0F2EC] border-[#303B33] hover:border-[#78977E]/50',
      danger: 'bg-[#E36B62]/20 hover:bg-[#E36B62]/30 text-[#E36B62] border-[#E36B62]/40',
      warning: 'bg-[#E5AA52]/20 hover:bg-[#E5AA52]/30 text-[#E5AA52] border-[#E5AA52]/40',
      outline: 'bg-transparent hover:bg-[#1B231E] text-[#F0F2EC] border-[#303B33]',
      ghost: 'bg-transparent hover:bg-[#202A24] text-[#9AA59C] hover:text-[#F0F2EC] border-transparent',
    };

    const sizeStyles = {
      sm: 'px-2.5 py-1 text-xs gap-1.5',
      md: 'px-3.5 py-1.5 text-sm gap-2',
      lg: 'px-4 py-2 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-sans tracking-wide transition-all border rounded-sm disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

