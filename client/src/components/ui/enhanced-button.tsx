import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'default' | 'gradient' | 'glass' | 'outline' | 'ghost' | 'enterprise';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  glow?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    variant = 'default', 
    size = 'md', 
    loading = false, 
    glow = false, 
    pulse = false,
    children, 
    className, 
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      gradient: 'btn-modern bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
      glass: 'glass-card hover:bg-white/20 text-white border border-white/30',
      outline: 'border-2 border-primary bg-transparent hover:bg-primary text-primary hover:text-primary-foreground',
      ghost: 'bg-transparent hover:bg-primary/10 text-primary',
      enterprise: 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white border border-slate-600'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    };

    const baseClasses = cn(
      'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant],
      sizes[size],
      glow && 'enterprise-glow',
      pulse && 'animate-pulse',
      'gpu-accelerated',
      className
    );

    const motionVariants = {
      whileHover: !disabled && !loading ? { 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      } : undefined,
      whileTap: !disabled && !loading ? { 
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1 }
      } : undefined
    };

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        variants={motionVariants}
        whileHover="whileHover"
        whileTap="whileTap"
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </motion.button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export { EnhancedButton };