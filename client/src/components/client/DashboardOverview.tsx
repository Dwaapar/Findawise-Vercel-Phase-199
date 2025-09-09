import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Clock, DollarSign, Users, Zap, Settings, BarChart3, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function DashboardOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const periods = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ];

  const services = [
    {
      id: 'workflow-automation',
      name: 'Workflow Automation',
      status: 'active',
      health: 98,
      savings: 15420,
      efficiency: 85,
      lastUpdate: '2 minutes ago',
      tasks: { completed: 1247, pending: 12, failed: 3 }
    },
    {
      id: 'data-analysis',
      name: 'AI Data Analysis',
      status: 'active',
      health: 95,
      savings: 8230,
      efficiency: 78,
      lastUpdate: '5 minutes ago',
      tasks: { completed: 892, pending: 8, failed: 1 }
    },
    {
      id: 'affiliate-optimization',
      name: 'Affiliate Network',
      status: 'maintenance',
      health: 87,
      savings: 12180,
      efficiency: 72,
      lastUpdate: '1 hour ago',
      tasks: { completed: 456, pending: 23, failed: 0 }
    },
    {
      id: 'finance-neuron',
      name: 'Finance Tools',
      status: 'active',
      health: 99,
      savings: 4560,
      efficiency: 91,
      lastUpdate: '1 minute ago',
      tasks: { completed: 334, pending: 2, failed: 0 }
    }
  ];

  const overallMetrics = {
    totalSavings: services.reduce((sum, s) => sum + s.savings, 0),
    avgEfficiency: Math.round(services.reduce((sum, s) => sum + s.efficiency, 0) / services.length),
    activeServices: services.filter(s => s.status === 'active').length,
    totalTasks: services.reduce((sum, s) => sum + s.tasks.completed + s.tasks.pending, 0),
    successRate: 97.2,
    monthlyGrowth: 23.5
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'maintenance': return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-600/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'maintenance': return AlertCircle;
      case 'error': return XCircle;
      default: return Activity;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Service Dashboard</h1>
          <p className="text-gray-400">Monitor your active services and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-800/50 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                  selectedPeriod === period.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Manage Services
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Total Savings</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(overallMetrics.totalSavings)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+{overallMetrics.monthlyGrowth}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Efficiency Rate</p>
                <p className="text-2xl font-bold text-white">{overallMetrics.avgEfficiency}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-blue-400 text-sm">Above target</span>
                </div>
              </div>
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Active Services</p>
                <p className="text-2xl font-bold text-white">{overallMetrics.activeServices}/{services.length}</p>
                <div className="flex items-center mt-1">
                  <Activity className="w-4 h-4 text-purple-400 mr-1" />
                  <span className="text-purple-400 text-sm">All systems</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-950/30 to-red-950/30 border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-white">{overallMetrics.successRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-orange-400 mr-1" />
                  <span className="text-orange-400 text-sm">Excellent</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {services.map((service) => {
          const StatusIcon = getStatusIcon(service.status);
          
          return (
            <Card key={service.id} className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                  <Badge className={getStatusColor(service.status)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {service.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Health Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Health Score</span>
                    <span className="text-white font-semibold">{service.health}%</span>
                  </div>
                  <Progress value={service.health} className="h-2" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">
                      {formatCurrency(service.savings)}
                    </div>
                    <div className="text-xs text-gray-400">Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">
                      {service.efficiency}%
                    </div>
                    <div className="text-xs text-gray-400">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {service.tasks.completed}
                    </div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                </div>

                {/* Task Status */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">
                      <span className="text-green-400">{service.tasks.completed}</span> done
                    </span>
                    <span className="text-gray-400">
                      <span className="text-yellow-400">{service.tasks.pending}</span> pending
                    </span>
                    {service.tasks.failed > 0 && (
                      <span className="text-gray-400">
                        <span className="text-red-400">{service.tasks.failed}</span> failed
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.lastUpdate}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white justify-start h-12">
              <Settings className="w-4 h-4 mr-3" />
              Configure Services
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white justify-start h-12">
              <BarChart3 className="w-4 h-4 mr-3" />
              View Analytics
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white justify-start h-12">
              <Users className="w-4 h-4 mr-3" />
              Manage Users
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}