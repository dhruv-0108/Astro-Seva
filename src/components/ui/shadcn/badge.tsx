import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all duration-200 focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border-amber-200/80 bg-amber-100/70 text-[#A14E15]',
        secondary:
          'border-stone-200 bg-stone-100 text-stone-700',
        emerald:
          'border-emerald-200/80 bg-emerald-100/70 text-emerald-800',
        destructive:
          'border-red-200/80 bg-red-100/70 text-red-700',
        outline:
          'border-stone-300 bg-transparent text-stone-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
