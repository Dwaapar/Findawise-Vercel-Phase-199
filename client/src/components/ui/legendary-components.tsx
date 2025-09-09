import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Legendary Glass Card Component
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  children: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, gradient = "from-gray-800/50 to-gray-900/50", blur = "xl", glow = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl border border-gray-700/50 backdrop-blur-xl",
          `bg-gradient-to-br ${gradient}`,
          `backdrop-blur-${blur}`,
          glow && "shadow-2xl shadow-cyan-500/20",
          "transition-all duration-300",
          className
        )}
        whileHover={{ 
          scale: 1.02,
          boxShadow: glow ? "0 25px 50px rgba(0, 245, 255, 0.3)" : undefined
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

// Neural Network Animation Component
export interface NeuralNetworkProps {
  size?: number;
  nodeCount?: number;
  animated?: boolean;
  className?: string;
}

export const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ 
  size = 120, 
  nodeCount = 12, 
  animated = true,
  className 
}) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i * (360 / nodeCount)) * Math.PI / 180;
    const radius = size * 0.35;
    const x = size / 2 + radius * Math.cos(angle);
    const y = size / 2 + radius * Math.sin(angle);
    return { x, y, id: i };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Connection lines */}
      {nodes.map((node, i) => (
        <motion.line
          key={`line-${i}`}
          x1={size / 2}
          y1={size / 2}
          x2={node.x}
          y2={node.y}
          stroke="url(#neuralGrad)"
          strokeWidth="1"
          opacity="0.3"
          filter="url(#glow)"
          animate={animated ? { opacity: [0.1, 0.6, 0.1] } : {}}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity
          }}
        />
      ))}
      
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={node.x}
          cy={node.y}
          r="3"
          fill="url(#neuralGrad)"
          filter="url(#glow)"
          animate={animated ? {
            r: [3, 6, 3],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Central brain */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r="8"
        fill="url(#neuralGrad)"
        filter="url(#glow)"
        animate={animated ? {
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        } : {}}
        transition={{
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 10, repeat: Infinity, ease: "linear" }
        }}
      />
    </svg>
  );
};

// Glowing Button Component
export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = true, children, ...props }, ref) => {
    const baseClasses = "font-semibold rounded-full transition-all duration-300 border";
    
    const variants = {
      primary: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400/50",
      secondary: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white border-purple-400/50 backdrop-blur-sm",
      ghost: "bg-transparent text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-8 py-4 text-lg",
      lg: "px-12 py-6 text-xl"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ 
          scale: 1.05,
          boxShadow: glow ? "0 20px 40px rgba(0, 245, 255, 0.3)" : undefined
        }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

GlowButton.displayName = "GlowButton";

// Animated Background
export const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Fixed animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, cyan 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, blue 0%, transparent 50%)',
              'radial-gradient(circle at 40% 20%, purple 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Status Indicator
export interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'warning' | 'error';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  animated = true, 
  size = 'md',
  className 
}) => {
  const colors = {
    active: 'bg-green-400',
    inactive: 'bg-gray-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400'
  };
  
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <motion.div
      className={cn(
        'rounded-full',
        colors[status],
        sizes[size],
        className
      )}
      animate={animated && status === 'active' ? {
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
};

// Metric Display
export interface MetricDisplayProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'cyan' | 'green' | 'yellow' | 'purple' | 'red';
  animated?: boolean;
  className?: string;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  icon,
  color = 'cyan',
  animated = true,
  className
}) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-600/20 text-cyan-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/20 text-yellow-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    red: 'from-red-500/20 to-red-600/20 text-red-400'
  };

  return (
    <GlassCard className={cn("p-6 text-center", className)}>
      <motion.div
        animate={animated ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn(
          "w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br flex items-center justify-center",
          colorClasses[color]
        )}
      >
        {icon}
      </motion.div>
      
      <motion.div 
        className={cn("text-4xl font-bold mb-2", colorClasses[color].split(' ')[1])}
        animate={animated ? { 
          textShadow: [`0 0 10px ${color === 'cyan' ? 'rgb(0, 245, 255, 0.5)' : 
                                   color === 'green' ? 'rgb(0, 255, 0, 0.5)' : 
                                   'rgb(255, 255, 0, 0.5)'}`] 
        } : {}}
      >
        {value}
      </motion.div>
      
      <div className="text-gray-400">{label}</div>
    </GlassCard>
  );
};