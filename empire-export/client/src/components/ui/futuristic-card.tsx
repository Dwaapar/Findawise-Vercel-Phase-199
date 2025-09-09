import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FuturisticCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  glowEffect?: boolean;
  hoverEffect?: boolean;
  delay?: number;
}

export function FuturisticCard({ 
  children, 
  className, 
  gradient = 'from-gray-900/50 to-gray-800/50',
  glowEffect = false,
  hoverEffect = true,
  delay = 0 
}: FuturisticCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden backdrop-blur-sm border border-gray-800/50 rounded-xl',
        `bg-gradient-to-br ${gradient}`,
        glowEffect && 'shadow-2xl shadow-purple-500/10',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={hoverEffect ? { 
        scale: 1.02, 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(139, 92, 246, 0.1)' 
      } : {}}
    >
      {/* Animated border gradient */}
      {glowEffect && (
        <div className="absolute inset-0 rounded-xl opacity-75">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 blur-sm" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
    </motion.div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  icon?: React.ReactNode;
  description?: string;
  animated?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  trend, 
  color = 'from-blue-500 to-cyan-500',
  icon,
  description,
  animated = true 
}: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <FuturisticCard className="p-6" glowEffect>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        {icon && (
          <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline space-x-2 mb-2">
        {animated ? (
          <motion.span
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {value}
          </motion.span>
        ) : (
          <span className="text-3xl font-bold text-white">{value}</span>
        )}
        {unit && <span className="text-gray-400 text-sm">{unit}</span>}
        {trend && (
          <span className={`text-xs font-medium ${getTrendColor()}`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: typeof value === 'number' ? `${Math.min(100, value)}%` : '100%' }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
      </div>
    </FuturisticCard>
  );
}

interface StatusCardProps {
  title: string;
  status: 'online' | 'offline' | 'warning' | 'error' | 'loading';
  message?: string;
  details?: string[];
  actions?: React.ReactNode;
}

export function StatusCard({ title, status, message, details, actions }: StatusCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'from-green-500 to-emerald-500',
          bgColor: 'from-green-900/20 to-emerald-900/20',
          dotColor: 'bg-green-400',
          textColor: 'text-green-400'
        };
      case 'warning':
        return {
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'from-yellow-900/20 to-orange-900/20',
          dotColor: 'bg-yellow-400',
          textColor: 'text-yellow-400'
        };
      case 'error':
        return {
          color: 'from-red-500 to-pink-500',
          bgColor: 'from-red-900/20 to-pink-900/20',
          dotColor: 'bg-red-400',
          textColor: 'text-red-400'
        };
      case 'loading':
        return {
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'from-blue-900/20 to-cyan-900/20',
          dotColor: 'bg-blue-400',
          textColor: 'text-blue-400'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'from-gray-900/20 to-gray-800/20',
          dotColor: 'bg-gray-400',
          textColor: 'text-gray-400'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <FuturisticCard 
      className="p-6" 
      gradient={config.bgColor}
      glowEffect={status === 'online'}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          <motion.div
            className={`w-3 h-3 rounded-full ${config.dotColor}`}
            animate={status === 'loading' ? { 
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1] 
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className={`text-sm font-medium ${config.textColor} uppercase`}>
            {status}
          </span>
        </div>
      </div>
      
      {message && (
        <p className="text-gray-300 mb-3">{message}</p>
      )}
      
      {details && details.length > 0 && (
        <div className="space-y-2 mb-4">
          {details.map((detail, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}
      
      {actions && (
        <div className="flex items-center space-x-2 mt-4">
          {actions}
        </div>
      )}
    </FuturisticCard>
  );
}