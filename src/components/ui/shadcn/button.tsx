import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#A14E15] text-white hover:bg-[#853E0F] shadow-[0_4px_16px_rgba(161,78,21,0.22)]',
        secondary:
          'bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-200/60',
        outline:
          'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 shadow-xs',
        ghost:
          'bg-transparent text-stone-600 hover:bg-stone-100/80 hover:text-stone-900',
        amberLight:
          'bg-amber-50 text-[#A14E15] hover:bg-amber-100/80 border border-amber-200/80',
      },
      size: {
        default: 'h-12 px-5 py-3 gap-2',
        sm: 'h-9 rounded-xl px-3.5 text-xs gap-1.5',
        lg: 'h-14 rounded-2xl px-6 py-4 text-base gap-2.5',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
