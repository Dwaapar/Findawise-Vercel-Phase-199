import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Activity, Shield, Database, Cpu, Network, 
  Zap, Eye, Target, TrendingUp, BarChart3, Globe,
  Lock, Bot, Sparkles, Code, Settings, Power,
  ChevronRight, Play, Pause, RefreshCw, AlertTriangle,
  CheckCircle, XCircle, Clock, Users, DollarSign,
  Layers, Command, Terminal, Rocket, Crown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
  isLoading?: boolean;
}

function MetricCard({ title, value, change, changeType, icon: Icon, color, isLoading }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className={`absolute -inset-px rounded-xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`text-sm font-semibold ${
              changeType === 'positive' ? 'text-green-400' :
              changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {change}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          {isLoading ? (
            <div className="h-8 bg-white/10 rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold text-white">{value}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface SystemStatusProps {
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  service: string;
  uptime?: string;
  lastCheck?: string;
}

function SystemStatus({ status, service, uptime, lastCheck }: SystemStatusProps) {
  const statusConfig = {
    operational: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle },
    degraded: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertTriangle },
    down: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
    maintenance: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Settings }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between p-4 rounded-lg ${config.bg} ${config.border} border backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3">
        <StatusIcon className={`w-5 h-5 ${config.color}`} />
        <div>
          <div className="font-semibold text-white">{service}</div>
          {lastCheck && (
            <div className="text-sm text-gray-400">Last check: {lastCheck}</div>
          )}
        </div>
      </div>
      
      {uptime && (
        <div className="text-right">
          <div className={`text-sm font-semibold ${config.color}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
          <div className="text-xs text-gray-400">{uptime} uptime</div>
        </div>
      )}
    </motion.div>
  );
}

interface AIActivityProps {
  activities: Array<{
    id: string;
    type: 'query' | 'training' | 'analysis' | 'optimization';
    description: string;
    timestamp: string;
    status: 'completed' | 'processing' | 'failed';
    duration?: string;
  }>;
}

function AIActivity({ activities }: AIActivityProps) {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className={`w-2 h-2 rounded-full ${
            activity.status === 'completed' ? 'bg-green-500' :
            activity.status === 'processing' ? 'bg-blue-500 animate-pulse' :
            'bg-red-500'
          }`} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">
                {activity.description}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activity.type === 'query' ? 'bg-blue-500/20 text-blue-400' :
                activity.type === 'training' ? 'bg-purple-500/20 text-purple-400' :
                activity.type === 'analysis' ? 'bg-green-500/20 text-green-400' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                {activity.type}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {activity.timestamp}
              {activity.duration && ` • ${activity.duration}`}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function EnterpriseDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [refreshKey, setRefreshKey] = useState(0);

  // Real-time queries
  const { data: systemStats, isLoading: statsLoading } = useQuery({
    queryKey: ['enterprise-stats', refreshKey],
    queryFn: () => fetch('/api/health').then(res => res.json()),
    refetchInterval: 5000,
  });

  const { data: aiMetrics, isLoading: aiLoading } = useQuery({
    queryKey: ['ai-metrics', refreshKey],
    queryFn: () => fetch('/api/llm-brain/metrics').then(res => res.json()),
    refetchInterval: 10000,
  });

  const { data: dbHealth, isLoading: dbLoading } = useQuery({
    queryKey: ['db-health', refreshKey],
    queryFn: () => fetch('/api/db-health').then(res => res.json()),
    refetchInterval: 15000,
  });

  const { data: neurons } = useQuery({
    queryKey: ['neural-federation', refreshKey],
    queryFn: () => fetch('/api/federation/dashboard').then(res => res.json()),
    refetchInterval: 20000,
  });

  // Mock AI activities for demo
  const aiActivities = [
    {
      id: '1',
      type: 'query' as const,
      description: 'Processing semantic search query',
      timestamp: '2 seconds ago',
      status: 'processing' as const,
      duration: '1.2s'
    },
    {
      id: '2', 
      type: 'analysis' as const,
      description: 'User behavior analysis completed',
      timestamp: '1 minute ago',
      status: 'completed' as const,
      duration: '0.8s'
    },
    {
      id: '3',
      type: 'optimization' as const,
      description: 'Database query optimization',
      timestamp: '3 minutes ago', 
      status: 'completed' as const,
      duration: '2.1s'
    }
  ];

  const refreshDashboard = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Empire Command Center</h1>
              <p className="text-gray-400">Real-time monitoring and control</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshDashboard}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center gap-2 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <MetricCard
            title="System Health"
            value="99.9%"
            change="+0.1%"
            changeType="positive"
            icon={Activity}
            color="from-green-500 to-emerald-500"
            isLoading={statsLoading}
          />
          <MetricCard
            title="AI Queries/sec"
            value={aiMetrics?.queriesPerSecond || "1,247"}
            change="+12%"
            changeType="positive"
            icon={Brain}
            color="from-purple-500 to-pink-500"
            isLoading={aiLoading}
          />
          <MetricCard
            title="Active Tables"
            value="450+"
            change="stable"
            changeType="neutral"
            icon={Database}
            color="from-blue-500 to-cyan-500"
            isLoading={dbLoading}
          />
          <MetricCard
            title="Revenue Today"
            value="$47,291"
            change="+23%"
            changeType="positive"
            icon={DollarSign}
            color="from-amber-500 to-orange-500"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Status
              </h2>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                All Systems Operational
              </div>
            </div>
            
            <div className="space-y-4">
              <SystemStatus
                status="operational"
                service="AI Brain Core"
                uptime="99.97%"
                lastCheck="30 seconds ago"
              />
              <SystemStatus
                status="operational"
                service="Database Cluster"
                uptime="99.99%"
                lastCheck="1 minute ago"
              />
              <SystemStatus
                status="operational"
                service="Neural Federation"
                uptime="99.95%"
                lastCheck="2 minutes ago"
              />
              <SystemStatus
                status="operational"
                service="Security Shield"
                uptime="100%"
                lastCheck="15 seconds ago"
              />
            </div>
          </motion.div>

          {/* AI Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Activity
              </h2>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-green-500"
              />
            </div>
            
            <AIActivity activities={aiActivities} />
          </motion.div>
        </div>

        {/* Neural Federation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5" />
              Neural Federation Overview
            </h2>
            <div className="text-sm text-gray-400">7 Active Neurons</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Security Neuron', status: 'active', load: '23%', color: 'from-red-500 to-orange-500' },
              { name: 'Finance Neuron', status: 'active', load: '67%', color: 'from-green-500 to-emerald-500' },
              { name: 'Health Neuron', status: 'active', load: '45%', color: 'from-blue-500 to-cyan-500' },
              { name: 'Travel Neuron', status: 'active', load: '32%', color: 'from-purple-500 to-pink-500' },
              { name: 'AI Tools Neuron', status: 'active', load: '78%', color: 'from-amber-500 to-orange-500' },
              { name: 'SaaS Neuron', status: 'standby', load: '12%', color: 'from-gray-500 to-slate-500' },
              { name: 'Commerce Neuron', status: 'active', load: '89%', color: 'from-indigo-500 to-purple-500' },
            ].map((neuron, index) => (
              <motion.div
                key={neuron.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    neuron.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <div className="text-xs text-gray-400">{neuron.load}</div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">
                    {neuron.name}
                  </h3>
                  
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${neuron.color}`}
                      style={{ width: neuron.load }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-400 capitalize">{neuron.status}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}