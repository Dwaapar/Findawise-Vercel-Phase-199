import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'glass-dark' | 'gradient' | 'enterprise';
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ variant = 'default', hover = true, glow = false, children, className, ...props }, ref) => {
    const variants = {
      default: 'card-modern bg-white/95 backdrop-blur-sm',
      glass: 'glass-card',
      'glass-dark': 'glass-card-dark',
      gradient: 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/20',
      enterprise: 'bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-white'
    };

    const baseClasses = cn(
      'rounded-xl p-6 transition-all duration-300',
      variants[variant],
      hover && 'hover-lift cursor-pointer',
      glow && 'enterprise-glow',
      'gpu-accelerated',
      className
    );

    const motionVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      whileHover: hover ? { 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined,
      whileTap: hover ? { scale: 0.98 } : undefined
    };

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        whileHover="whileHover"
        whileTap="whileTap"
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

export { EnhancedCard };