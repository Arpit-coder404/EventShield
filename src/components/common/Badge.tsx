import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'muted' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'muted',
  className,
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    green: 'bg-[#64B58A]/15 text-[#64B58A] border-[#64B58A]/30',
    amber: 'bg-[#E5AA52]/15 text-[#E5AA52] border-[#E5AA52]/30',
    red: 'bg-[#E36B62]/15 text-[#E36B62] border-[#E36B62]/30',
    blue: 'bg-[#80A8C8]/15 text-[#80A8C8] border-[#80A8C8]/30',
    muted: 'bg-[#202A24] text-[#9AA59C] border-[#303B33]',
    outline: 'border-[#303B33] text-[#F0F2EC]',
  };

  const dotColors: Record<BadgeVariant, string> = {
    green: 'bg-[#64B58A]',
    amber: 'bg-[#E5AA52]',
    red: 'bg-[#E36B62]',
    blue: 'bg-[#80A8C8]',
    muted: 'bg-[#9AA59C]',
    outline: 'bg-[#F0F2EC]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-medium border rounded-sm tracking-wider uppercase',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full inline-block',
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
};

