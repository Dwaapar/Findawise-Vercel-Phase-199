import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, Server, Network, Activity, MapPin, Zap,
  Users, Database, Shield, BarChart3, Settings
} from "lucide-react";

interface FederationControlCenterProps {
  onNavigate: (path: string) => void;
}

const FederationControlCenter = ({ onNavigate }: FederationControlCenterProps) => {
  const [federationMetrics, setFederationMetrics] = useState({
    globalNodes: 12,
    activeNeurons: 247,
    totalRequests: 1847593,
    dataSync: 99.7,
    networkLatency: 23,
    replicationHealth: 98.9
  });

  const globalNodes = [
    { region: "US East", location: "Virginia", status: "active", neurons: 67, latency: 12, load: 73 },
    { region: "US West", location: "California", status: "active", neurons: 52, latency: 15, load: 68 },
    { region: "EU Central", location: "Frankfurt", status: "active", neurons: 43, latency: 8, load: 81 },
    { region: "EU West", location: "London", status: "active", neurons: 38, latency: 11, load: 62 },
    { region: "Asia Pacific", location: "Singapore", status: "active", neurons: 29, latency: 18, load: 55 },
    { region: "Asia East", location: "Tokyo", status: "active", neurons: 18, latency: 21, load: 49 }
  ];

  const neuronTypes = [
    { type: "AI/ML Neurons", count: 47, status: "optimal", color: "purple" },
    { type: "Content Neurons", count: 83, status: "optimal", color: "blue" },
    { type: "Analytics Neurons", count: 62, status: "optimal", color: "green" },
    { type: "Security Neurons", count: 28, status: "optimal", color: "red" },
    { type: "Commerce Neurons", count: 27, status: "optimal", color: "yellow" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "optimal": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 50) return "text-green-400";
    if (load < 80) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Federation Control Center
                </h1>
                <p className="text-gray-400">Global neuron federation and multi-region orchestration</p>
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
            <TabsTrigger value="overview">Global Overview</TabsTrigger>
            <TabsTrigger value="nodes">Node Management</TabsTrigger>
            <TabsTrigger value="neurons">Neuron Registry</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Federation Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Global Nodes</p>
                      <p className="text-2xl font-bold text-blue-400">{federationMetrics.globalNodes}</p>
                    </div>
                    <Server className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Neurons</p>
                      <p className="text-2xl font-bold text-cyan-400">{federationMetrics.activeNeurons}</p>
                    </div>
                    <Network className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Requests</p>
                      <p className="text-2xl font-bold text-green-400">{(federationMetrics.totalRequests / 1000000).toFixed(1)}M</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Data Sync</p>
                      <p className="text-2xl font-bold text-purple-400">{federationMetrics.dataSync}%</p>
                    </div>
                    <Database className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Latency</p>
                      <p className="text-2xl font-bold text-yellow-400">{federationMetrics.networkLatency}ms</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Replication</p>
                      <p className="text-2xl font-bold text-indigo-400">{federationMetrics.replicationHealth}%</p>
                    </div>
                    <Shield className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Global Nodes Map */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Global Node Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {globalNodes.map((node, index) => (
                    <Card key={index} className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-white">{node.region}</h4>
                            <p className="text-sm text-gray-400">{node.location}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Neurons</span>
                            <span className="text-cyan-400">{node.neurons}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Latency</span>
                            <span className="text-green-400">{node.latency}ms</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Load</span>
                            <span className={getLoadColor(node.load)}>{node.load}%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                            <div 
                              className={`${node.load < 80 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${node.load}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nodes" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Node Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Server className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Global Node Administration</h3>
                  <p className="text-gray-400 mb-4">Manage federation nodes across all regions</p>
                  <Button 
                    onClick={() => onNavigate("/admin/neuron-federation")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Access Node Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="neurons" className="space-y-6">
            {/* Neuron Types Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neuronTypes.map((neuron, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{neuron.type}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(neuron.status)}`} />
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {neuron.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-cyan-400">{neuron.count}</span>
                      <Button 
                        size="sm" 
                        className={`bg-gradient-to-r from-${neuron.color}-500 to-${neuron.color}-600 hover:opacity-90`}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Real-time Federation Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Federation Analytics</h3>
                  <p className="text-gray-400 mb-4">Monitor federation performance and health metrics</p>
                  <Button 
                    onClick={() => onNavigate("/analytics-intelligence")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Access Monitoring Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FederationControlCenter;