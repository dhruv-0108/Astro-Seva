import * as React from 'react';
import { cn } from '../../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-4 text-stone-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-14 w-full rounded-2xl border border-stone-200 bg-white text-base text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 focus:border-[#B45309] focus:ring-4 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:opacity-50',
            icon ? 'pl-11 pr-4' : 'px-4',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
