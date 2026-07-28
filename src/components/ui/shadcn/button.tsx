import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#A14E15] text-white hover:bg-[#883E0F] shadow-md hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'bg-white border border-stone-300 text-[#1F1E1B] hover:bg-stone-50 shadow-xs hover:-translate-y-0.5 active:translate-y-0',
        outline:
          'bg-white border border-stone-300 text-[#1F1E1B] hover:bg-stone-50 shadow-xs hover:-translate-y-0.5 active:translate-y-0',
        ghost: 'bg-transparent text-[#1F1E1B] hover:underline shadow-none',
        link: 'text-[#A14E15] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-[56px] px-6 py-4 text-base',
        sm: 'h-10 px-4 text-sm rounded-xl',
        lg: 'h-[56px] px-8 text-base rounded-2xl',
        icon: 'h-[56px] w-[56px]',
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
    VariantProps<typeof buttonVariants> {}

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
