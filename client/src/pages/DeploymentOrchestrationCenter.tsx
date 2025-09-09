import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, Database, Globe, Activity, Zap, Settings,
  GitBranch, Shield, BarChart3, CheckCircle, AlertTriangle
} from "lucide-react";

interface DeploymentOrchestrationCenterProps {
  onNavigate: (path: string) => void;
}

const DeploymentOrchestrationCenter = ({ onNavigate }: DeploymentOrchestrationCenterProps) => {
  const [deploymentMetrics, setDeploymentMetrics] = useState({
    activeEnvironments: 12,
    deploymentsToday: 47,
    successRate: 99.2,
    averageDeployTime: 142,
    globalRegions: 6,
    healthScore: 98.7,
    activeServices: 284,
    uptime: 99.98
  });

  const deploymentEnvironments = [
    {
      name: "Production Global",
      status: "healthy",
      region: "Multi-Region",
      services: 94,
      uptime: 99.98,
      lastDeploy: "2 hours ago",
      path: "/deployment-orchestration",
      icon: Globe,
      color: "green"
    },
    {
      name: "Staging Environment",
      status: "healthy",
      region: "US-East",
      services: 89,
      uptime: 99.95,
      lastDeploy: "45 min ago",
      path: "/deployment-orchestration",
      icon: Server,
      color: "blue"
    },
    {
      name: "Development Cluster",
      status: "deploying",
      region: "US-West",
      services: 67,
      uptime: 99.89,
      lastDeploy: "ongoing",
      path: "/deployment-orchestration",
      icon: GitBranch,
      color: "yellow"
    },
    {
      name: "Testing Environment",
      status: "healthy",
      region: "EU-Central",
      services: 34,
      uptime: 99.91,
      lastDeploy: "3 hours ago",
      path: "/deployment-orchestration",
      icon: CheckCircle,
      color: "purple"
    },
    {
      name: "Database Cluster",
      status: "optimal",
      region: "Multi-Region",
      services: 12,
      uptime: 99.99,
      lastDeploy: "6 hours ago",
      path: "/deployment-orchestration",
      icon: Database,
      color: "cyan"
    },
    {
      name: "Edge Network",
      status: "optimal",
      region: "Global CDN",
      services: 156,
      uptime: 99.97,
      lastDeploy: "1 hour ago",
      path: "/deployment-orchestration",
      icon: Zap,
      color: "indigo"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": case "optimal": return "bg-green-500";
      case "deploying": return "bg-yellow-500";
      case "warning": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return "text-green-400";
    if (uptime >= 99.5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl">
                <Server className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Deployment Orchestration Center
                </h1>
                <p className="text-gray-400">Multi-region deployment, infrastructure management, and orchestration</p>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate("/enterprise-command")}
              variant="outline"
              className="border-gray-600 hover:bg-gray-800"
            >
              ← Command Center
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview">Deployment Overview</TabsTrigger>
            <TabsTrigger value="environments">Environment Management</TabsTrigger>
            <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
            <TabsTrigger value="monitoring">Infrastructure Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Deployment Status Banner */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">All Systems Operational</h2>
                      <p className="text-gray-400">Global infrastructure running at {deploymentMetrics.uptime}% uptime</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-400">{deploymentMetrics.healthScore}%</div>
                    <p className="text-gray-400">Health Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deployment Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Environments</p>
                      <p className="text-2xl font-bold text-orange-400">{deploymentMetrics.activeEnvironments}</p>
                    </div>
                    <Server className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Deployments Today</p>
                      <p className="text-2xl font-bold text-blue-400">{deploymentMetrics.deploymentsToday}</p>
                    </div>
                    <GitBranch className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Success Rate</p>
                      <p className="text-2xl font-bold text-green-400">{deploymentMetrics.successRate}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Deploy Time</p>
                      <p className="text-2xl font-bold text-purple-400">{deploymentMetrics.averageDeployTime}s</p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Global Regions</p>
                      <p className="text-2xl font-bold text-cyan-400">{deploymentMetrics.globalRegions}</p>
                    </div>
                    <Globe className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Health Score</p>
                      <p className="text-2xl font-bold text-green-400">{deploymentMetrics.healthScore}%</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Services</p>
                      <p className="text-2xl font-bold text-indigo-400">{deploymentMetrics.activeServices}</p>
                    </div>
                    <Settings className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">System Uptime</p>
                      <p className="text-2xl font-bold text-green-400">{deploymentMetrics.uptime}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deployment Environments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deploymentEnvironments.map((environment, index) => (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate(environment.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-gradient-to-r from-${environment.color}-500 to-${environment.color}-600 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <environment.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(environment.status)}`} />
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {environment.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-orange-400 transition-colors">
                      {environment.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Region</span>
                        <span className="text-blue-400">{environment.region}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Services</span>
                        <span className="text-cyan-400">{environment.services}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Uptime</span>
                        <span className={getUptimeColor(environment.uptime)}>{environment.uptime}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Deploy</span>
                        <span className="text-green-400">{environment.lastDeploy}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className={`w-full bg-gradient-to-r from-${environment.color}-500 to-${environment.color}-600 hover:opacity-90`}
                      >
                        Manage →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="environments" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Environment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Server className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Multi-Environment Management</h3>
                  <p className="text-gray-400 mb-4">Deploy and manage across development, staging, and production environments</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <Button 
                      onClick={() => onNavigate("/admin/empire-launchpad")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <GitBranch className="mr-2 h-4 w-4" />
                      Empire Launchpad
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/data-management")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Data Management
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/federation-control")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Federation Control
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orchestration" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Deployment Orchestration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Zap className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Automated Deployment Workflows</h3>
                  <p className="text-gray-400 mb-4">Orchestrate complex deployments across multiple regions and environments</p>
                  <Button 
                    onClick={() => onNavigate("/admin/empire-launchpad")}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  >
                    Access Orchestration Tools
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Infrastructure Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Real-time Infrastructure Monitoring</h3>
                  <p className="text-gray-400 mb-4">Monitor performance, health, and resource utilization across all environments</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <Button 
                      onClick={() => onNavigate("/analytics-intelligence")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Performance Analytics
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/security-control")}
                      className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security Monitoring
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/cross-device")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Real-time Metrics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeploymentOrchestrationCenter;