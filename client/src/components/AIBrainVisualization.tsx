import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Activity, Zap, Network, Target, Shield,
  Cpu, Database, Eye, Bot, Sparkles, Code
} from 'lucide-react';
import { FuturisticCard, StatusCard } from '@/components/ui/futuristic-card';

interface AIBrainVisualizationProps {
  aiStatus?: any;
  className?: string;
}

export function AIBrainVisualization({ aiStatus, className = '' }: AIBrainVisualizationProps) {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [brainActivity, setBrainActivity] = useState(0);
  const [processingMode, setProcessingMode] = useState<'idle' | 'learning' | 'inference' | 'training'>('idle');

  // Simulate brain activity
  useEffect(() => {
    const interval = setInterval(() => {
      setBrainActivity(prev => Math.max(0, prev + (Math.random() - 0.5) * 20));
      setActiveNodes(prev => {
        const newNodes = [...prev];
        // Add random nodes
        if (Math.random() > 0.7) {
          const nodeId = Math.floor(Math.random() * 24);
          if (!newNodes.includes(nodeId)) {
            newNodes.push(nodeId);
          }
        }
        // Remove random nodes
        if (Math.random() > 0.8 && newNodes.length > 0) {
          newNodes.splice(Math.floor(Math.random() * newNodes.length), 1);
        }
        return newNodes.slice(0, 8); // Keep max 8 active nodes
      });
      
      // Change processing mode based on activity
      if (brainActivity > 80) setProcessingMode('training');
      else if (brainActivity > 60) setProcessingMode('learning');
      else if (brainActivity > 30) setProcessingMode('inference');
      else setProcessingMode('idle');
    }, 1000);

    return () => clearInterval(interval);
  }, [brainActivity]);

  const neuralNodes = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: 50 + Math.cos(i * 0.26) * (30 + Math.sin(i * 0.7) * 10),
    y: 50 + Math.sin(i * 0.26) * (30 + Math.cos(i * 0.7) * 10),
    size: 4 + Math.random() * 3,
    type: ['input', 'hidden', 'output'][Math.floor(i / 8)]
  }));

  const getNodeColor = (nodeType: string, isActive: boolean) => {
    if (!isActive) return 'rgba(75, 85, 99, 0.3)';
    
    switch (nodeType) {
      case 'input': return 'rgba(34, 197, 94, 0.8)';
      case 'hidden': return 'rgba(168, 85, 247, 0.8)';
      case 'output': return 'rgba(59, 130, 246, 0.8)';
      default: return 'rgba(156, 163, 175, 0.8)';
    }
  };

  const getModeConfig = () => {
    switch (processingMode) {
      case 'training':
        return {
          color: 'from-red-500 to-orange-500',
          bgColor: 'from-red-900/20 to-orange-900/20',
          icon: Target,
          label: 'Deep Training',
          description: 'Optimizing neural pathways'
        };
      case 'learning':
        return {
          color: 'from-purple-500 to-pink-500',
          bgColor: 'from-purple-900/20 to-pink-900/20',
          icon: Brain,
          label: 'Active Learning',
          description: 'Processing new information'
        };
      case 'inference':
        return {
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'from-blue-900/20 to-cyan-900/20',
          icon: Zap,
          label: 'Inference Mode',
          description: 'Generating responses'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'from-gray-900/20 to-gray-800/20',
          icon: Eye,
          label: 'Monitoring',
          description: 'Waiting for input'
        };
    }
  };

  const modeConfig = getModeConfig();
  const ModeIcon = modeConfig.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Brain Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="AI Brain Core"
          status={aiStatus?.data?.status?.status === 'operational' ? 'online' : 'offline'}
          message={`${Object.keys(aiStatus?.data?.status?.providers || {}).length} providers active`}
          details={[
            `Mode: ${modeConfig.label}`,
            `Activity: ${Math.round(brainActivity)}%`,
            `Response Time: ${aiStatus?.data?.status?.performance?.averageLatency || 0}ms`
          ]}
        />
        
        <StatusCard
          title="Neural Processing"
          status={processingMode === 'idle' ? 'offline' : 'online'}
          message={modeConfig.description}
          details={[
            `Active Nodes: ${activeNodes.length}/24`,
            `Throughput: ${aiStatus?.data?.status?.performance?.throughputPerSecond || 0}/sec`,
            `Cache Hit: ${Math.round(aiStatus?.data?.status?.performance?.cacheHitRate || 0)}%`
          ]}
        />
        
        <StatusCard
          title="Integration Ready"
          status="online"
          message="Ready for Ollama integration"
          details={[
            'Local LLM support enabled',
            'Fallback providers configured',
            'Auto-scaling active'
          ]}
        />
      </div>

      {/* Neural Network Visualization */}
      <FuturisticCard className="p-8" gradient={modeConfig.bgColor} glowEffect>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${modeConfig.color} rounded-xl flex items-center justify-center`}>
              <ModeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Neural Network Visualization</h2>
              <p className="text-gray-400">{modeConfig.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Processing Mode</div>
            <div className={`text-lg font-semibold bg-gradient-to-r ${modeConfig.color} bg-clip-text text-transparent`}>
              {modeConfig.label.toUpperCase()}
            </div>
          </div>
        </div>

        {/* SVG Neural Network */}
        <div className="relative">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-80 bg-gray-900/30 rounded-lg border border-gray-700"
          >
            {/* Neural connections */}
            {neuralNodes.map((node, i) => 
              neuralNodes.slice(i + 1).map((targetNode, j) => {
                const distance = Math.sqrt(
                  Math.pow(node.x - targetNode.x, 2) + 
                  Math.pow(node.y - targetNode.y, 2)
                );
                
                if (distance < 25 && (activeNodes.includes(node.id) || activeNodes.includes(targetNode.id))) {
                  return (
                    <motion.line
                      key={`${node.id}-${targetNode.id}`}
                      x1={node.x}
                      y1={node.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="rgba(168, 85, 247, 0.3)"
                      strokeWidth="0.2"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0.3, 0.8, 0.3],
                        strokeWidth: [0.2, 0.4, 0.2]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  );
                }
                return null;
              })
            )}
            
            {/* Neural nodes */}
            {neuralNodes.map(node => (
              <motion.circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={getNodeColor(node.type, activeNodes.includes(node.id))}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: activeNodes.includes(node.id) ? [1, 1.3, 1] : 1,
                  fill: getNodeColor(node.type, activeNodes.includes(node.id))
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: activeNodes.includes(node.id) ? Infinity : 0,
                  repeatDelay: 1
                }}
              />
            ))}
            
            {/* Pulsing center core */}
            <motion.circle
              cx="50"
              cy="50"
              r="6"
              fill="url(#brainGradient)"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            />
            
            <defs>
              <radialGradient id="brainGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 1)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 1)" />
              </radialGradient>
            </defs>
          </svg>
          
          {/* Activity indicators */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-gray-300">Input Layer</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span className="text-gray-300">Hidden Layer</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-gray-300">Output Layer</span>
            </div>
          </div>
        </div>

        {/* Activity meter */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Neural Activity</span>
            <span className="text-sm font-medium text-white">{Math.round(brainActivity)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${modeConfig.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, brainActivity)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </FuturisticCard>

      {/* Provider Status */}
      {aiStatus?.data?.status?.providers && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(aiStatus.data.status.providers).map(([name, provider]: [string, any]) => (
            <FuturisticCard key={name} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white capitalize">{name}</h3>
                <div className={`w-2 h-2 rounded-full ${
                  provider.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
                }`} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={provider.status === 'healthy' ? 'text-green-400' : 'text-red-400'}>
                    {provider.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Response</span>
                  <span className="text-white">{provider.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Requests</span>
                  <span className="text-white">{provider.requestCount}</span>
                </div>
              </div>
            </FuturisticCard>
          ))}
        </div>
      )}
    </div>
  );
}