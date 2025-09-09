import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  animation?: 'pulse' | 'wave' | 'none';
}

export function LoadingSkeleton({ 
  className, 
  variant = 'rectangular', 
  animation = 'pulse' 
}: LoadingSkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-24 w-full rounded-lg',
    card: 'h-48 w-full rounded-xl'
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'skeleton',
    none: ''
  };

  return (
    <div 
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variants[variant],
        animations[animation],
        className
      )}
    />
  );
}

interface SkeletonListProps {
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  className?: string;
}

export function SkeletonList({ count = 3, variant = 'rectangular', className }: SkeletonListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}