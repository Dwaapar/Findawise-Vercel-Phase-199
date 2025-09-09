import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Download, Upload, Clock, CheckCircle, AlertTriangle,
  RefreshCw, Archive, Trash2, Eye, Settings, Shield
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface BackupEntry {
  id: string;
  timestamp: string;
  size: number;
  pluginCount: number;
  stateChecksum: string;
  status: 'success' | 'error' | 'partial';
  filePath: string;
  metadata: {
    systemVersion: string;
    userAction?: string;
    triggeredBy: 'automatic' | 'manual' | 'migration';
  };
}

interface StateSnapshot {
  timestamp: string;
  pluginStates: Record<string, any>;
  systemHealth: {
    cpu: number;
    memory: number;
    activePlugins: number;
  };
  trackingData: {
    userSessions: number;
    apiCalls: number;
    errors: number;
  };
}

export function PluginBackupManager() {
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showStateDetails, setShowStateDetails] = useState(false);
  const queryClient = useQueryClient();

  // Fetch backup history
  const { data: backups, isLoading } = useQuery<BackupEntry[]>({
    queryKey: ['plugin-backups'],
    queryFn: () => fetch('/api/plugins/backups').then(res => res.json()),
    refetchInterval: 10000,
  });

  // Fetch current state snapshot
  const { data: currentState } = useQuery<StateSnapshot>({
    queryKey: ['plugin-state'],
    queryFn: () => fetch('/api/plugins/state').then(res => res.json()),
    refetchInterval: 5000,
  });

  // Create manual backup
  const createBackupMutation = useMutation({
    mutationFn: (reason: string) => 
      fetch('/api/plugins/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, triggeredBy: 'manual' })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugin-backups'] });
    }
  });

  // Restore from backup
  const restoreBackupMutation = useMutation({
    mutationFn: (backupId: string) =>
      fetch(`/api/plugins/restore/${backupId}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugin-state'] });
    }
  });

  // Delete backup
  const deleteBackupMutation = useMutation({
    mutationFn: (backupId: string) =>
      fetch(`/api/plugins/backup/${backupId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugin-backups'] });
    }
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'partial': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'error': return AlertTriangle;
      case 'partial': return Clock;
      default: return Database;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Plugin Backup Manager</h2>
          <p className="text-gray-400">State management and tracking for all plugins</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowStateDetails(!showStateDetails)}
            className="flex items-center space-x-2 bg-blue-600/20 border border-blue-500/30 
                     text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Current State</span>
          </button>
          
          <button
            onClick={() => createBackupMutation.mutate('Manual backup')}
            disabled={createBackupMutation.isPending}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg 
                     hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {createBackupMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Archive className="w-4 h-4" />
            )}
            <span>Create Backup</span>
          </button>
        </div>
      </div>

      {/* Current State Panel */}
      <AnimatePresence>
        {showStateDetails && currentState && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 
                     rounded-xl p-6 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Current System State</span>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* System Health */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-300">System Health</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">CPU Usage:</span>
                    <span className="text-white">{currentState.systemHealth.cpu.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Memory:</span>
                    <span className="text-white">{currentState.systemHealth.memory.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Plugins:</span>
                    <span className="text-white">{currentState.systemHealth.activePlugins}</span>
                  </div>
                </div>
              </div>

              {/* Tracking Data */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-300">Tracking Data</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">User Sessions:</span>
                    <span className="text-white">{currentState.trackingData.userSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">API Calls:</span>
                    <span className="text-white">{currentState.trackingData.apiCalls.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Errors:</span>
                    <span className="text-red-400">{currentState.trackingData.errors}</span>
                  </div>
                </div>
              </div>

              {/* Plugin States */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-300">Plugin States</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {Object.entries(currentState.pluginStates).map(([name, state]: [string, any]) => (
                    <div key={name} className="flex justify-between text-sm">
                      <span className="text-gray-400 truncate">{name}:</span>
                      <span className={`${state.healthy ? 'text-green-400' : 'text-red-400'}`}>
                        {state.healthy ? 'Healthy' : 'Error'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backup History */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 
                    rounded-xl backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Database className="w-5 h-5 text-purple-400" />
            <span>Backup History</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-400">Loading backup history...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {backups?.map((backup) => {
              const StatusIcon = getStatusIcon(backup.status);
              
              return (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-6 hover:bg-white/5 transition-colors cursor-pointer ${
                    selectedBackup === backup.id ? 'bg-purple-600/10 border-l-4 border-purple-500' : ''
                  }`}
                  onClick={() => setSelectedBackup(
                    selectedBackup === backup.id ? null : backup.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <StatusIcon className={`w-5 h-5 ${getStatusColor(backup.status)}`} />
                      
                      <div>
                        <div className="font-semibold text-white">
                          {formatTime(backup.timestamp)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {backup.pluginCount} plugins • {formatSize(backup.size)} • 
                          {backup.metadata.triggeredBy}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Download backup
                          window.open(`/api/plugins/backup/${backup.id}/download`);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Download backup"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Restore from this backup? This will overwrite current state.')) {
                            restoreBackupMutation.mutate(backup.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                        title="Restore backup"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this backup? This action cannot be undone.')) {
                            deleteBackupMutation.mutate(backup.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete backup"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedBackup === backup.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-700/50"
                      >
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Backup Details</h4>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-400">File Path:</span>
                                <span className="text-white font-mono text-xs">{backup.filePath}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Checksum:</span>
                                <span className="text-white font-mono text-xs">
                                  {backup.stateChecksum.substring(0, 8)}...
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">System Version:</span>
                                <span className="text-white">{backup.metadata.systemVersion}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Backup Trigger</h4>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Triggered By:</span>
                                <span className="text-white capitalize">{backup.metadata.triggeredBy}</span>
                              </div>
                              {backup.metadata.userAction && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">User Action:</span>
                                  <span className="text-white">{backup.metadata.userAction}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}