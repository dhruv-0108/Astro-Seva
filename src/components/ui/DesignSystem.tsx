'use client';

import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

/* ==========================================================================
   DESIGN SYSTEM TOKENS & UTILITIES
   Colors: Warm Off-White (#FAF9F5), Slate (#1C1917), Muted Stone (#78716C), Amber Accent (#B45309)
   ========================================================================== */

// --- BUTTON PRIMITIVE ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-[#B45309] text-white hover:bg-[#92400E] active:bg-[#78350F] shadow-[0_4px_14px_rgba(180,83,9,0.25)]',
    secondary:
      'bg-stone-100 text-stone-900 hover:bg-stone-200 active:bg-stone-300',
    outline:
      'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 active:bg-stone-100 shadow-xs',
    ghost:
      'bg-transparent text-stone-600 hover:bg-stone-100/80 active:bg-stone-200/80 text-stone-900',
    danger:
      'bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 border border-red-200',
  };

  const sizes = {
    sm: 'text-xs py-2 px-3.5 gap-1.5',
    md: 'text-sm py-3 px-5 gap-2 min-h-[44px]',
    lg: 'text-base py-4 px-6 gap-2.5 min-h-[52px]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
};

// --- CARD PRIMITIVE ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  selected = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 sm:p-8 transition-all duration-200 ${
        selected
          ? 'ring-2 ring-[#B45309] shadow-[0_8px_30px_rgba(180,83,9,0.12)] bg-amber-50/20'
          : 'shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-200/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// --- INPUT PRIMITIVE ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </label>
      )}
      <input
        className={`w-full bg-white border border-stone-200 rounded-2xl p-4 text-base text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 focus:border-[#B45309] focus:ring-4 focus:ring-amber-500/10 ${
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </div>
  );
};

// --- SELECT PRIMITIVE ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  icon,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </label>
      )}
      <select
        className={`w-full bg-white border border-stone-200 rounded-2xl p-4 text-base font-medium text-stone-900 outline-none transition-all duration-200 focus:border-[#B45309] focus:ring-4 focus:ring-amber-500/10 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

// --- BADGE PRIMITIVE ---
interface BadgeProps {
  variant?: 'amber' | 'green' | 'stone' | 'red';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'stone',
  children,
  className = '',
}) => {
  const variants = {
    amber: 'bg-amber-100/70 text-[#B45309] border border-amber-200/80',
    green: 'bg-emerald-100/70 text-emerald-800 border border-emerald-200/80',
    stone: 'bg-stone-100 text-stone-700 border border-stone-200',
    red: 'bg-red-100/70 text-red-700 border border-red-200/80',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// --- PROGRESS STEPS PRIMITIVE ---
interface ProgressStepsProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  return (
    <div className="flex justify-center items-center gap-3 my-6">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
              currentStep === i
                ? 'bg-[#B45309] text-white ring-4 ring-amber-100 shadow-md scale-110'
                : currentStep > i
                ? 'bg-amber-800 text-white'
                : 'bg-stone-200 text-stone-500'
            }`}
          >
            {currentStep > i ? '✓' : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-12 sm:w-16 h-1 rounded-full transition-all duration-300 ${
                currentStep > i ? 'bg-[#B45309]' : 'bg-stone-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// --- ERROR BANNER ---
export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="bg-red-50/80 border border-red-200/80 text-red-700 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
      <span>{message}</span>
    </div>
  );
};
