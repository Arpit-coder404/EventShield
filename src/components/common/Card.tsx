import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  noPadding = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-[#1B231E] border border-[#303B33] rounded-sm flex flex-col overflow-hidden',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-4 py-3 border-b border-[#303B33] bg-[#151C18]/60 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className={cn(noPadding ? 'p-0' : 'p-4', 'flex-1')}>
        {children}
      </div>
      {footer && (
        <div className="px-4 py-2.5 border-t border-[#303B33] bg-[#151C18]/40">
          {footer}
        </div>
      )}
    </div>
  );
};

