import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Cpu, Database, Network, Zap, Settings,
  BarChart3, Activity, Code, GitBranch, Play, Pause
} from "lucide-react";

interface AIIntelligenceCenterProps {
  onNavigate: (path: string) => void;
}

const AIIntelligenceCenter = ({ onNavigate }: AIIntelligenceCenterProps) => {
  const [aiMetrics, setAiMetrics] = useState({
    llmRequests: 15847,
    vectorSearches: 8932,
    semanticQueries: 4521,
    mlPredictions: 29384,
    aiModelsActive: 47,
    processingLatency: 142
  });

  const aiSystems = [
    {
      name: "LLM Orchestration Engine",
      status: "active",
      performance: 98.7,
      requests: "15.8K/day",
      path: "/admin/ai-ml-center",
      icon: Brain,
      color: "purple"
    },
    {
      name: "Vector Search Intelligence", 
      status: "active",
      performance: 99.2,
      requests: "8.9K/day",
      path: "/admin/vector-search",
      icon: Database,
      color: "blue"
    },
    {
      name: "Semantic Graph Engine",
      status: "active", 
      performance: 97.4,
      requests: "4.5K/day",
      path: "/admin/semantic-graph",
      icon: Network,
      color: "green"
    },
    {
      name: "RLHF Brain System",
      status: "training",
      performance: 94.1,
      requests: "12.3K/day", 
      path: "/admin/rlhf-brain",
      icon: Cpu,
      color: "yellow"
    },
    {
      name: "AI-Native OS",
      status: "active",
      performance: 96.8,
      requests: "22.1K/day",
      path: "/admin/ai-native-os", 
      icon: Code,
      color: "indigo"
    },
    {
      name: "Offline AI Sync Engine",
      status: "syncing",
      performance: 99.9,
      requests: "5.2K/day",
      path: "/admin/offline-ai",
      icon: GitBranch,
      color: "cyan"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "training": return "bg-yellow-500";
      case "syncing": return "bg-blue-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  AI Intelligence Center
                </h1>
                <p className="text-gray-400">Autonomous AI orchestration and management</p>
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
            <TabsTrigger value="overview">AI Overview</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Real-time AI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">LLM Requests</p>
                      <p className="text-2xl font-bold text-purple-400">{(aiMetrics.llmRequests / 1000).toFixed(1)}K</p>
                    </div>
                    <Brain className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Vector Searches</p>
                      <p className="text-2xl font-bold text-blue-400">{(aiMetrics.vectorSearches / 1000).toFixed(1)}K</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Semantic Queries</p>
                      <p className="text-2xl font-bold text-green-400">{(aiMetrics.semanticQueries / 1000).toFixed(1)}K</p>
                    </div>
                    <Network className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">ML Predictions</p>
                      <p className="text-2xl font-bold text-yellow-400">{(aiMetrics.mlPredictions / 1000).toFixed(1)}K</p>
                    </div>
                    <Cpu className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Models</p>
                      <p className="text-2xl font-bold text-indigo-400">{aiMetrics.aiModelsActive}</p>
                    </div>
                    <Code className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Latency</p>
                      <p className="text-2xl font-bold text-cyan-400">{aiMetrics.processingLatency}ms</p>
                    </div>
                    <Activity className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Systems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiSystems.map((system, index) => (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate(system.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-gradient-to-r from-${system.color}-500 to-${system.color}-600 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <system.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(system.status)}`} />
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {system.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-purple-400 transition-colors">
                      {system.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Performance</span>
                        <span className="text-green-400 font-medium">{system.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r from-${system.color}-500 to-${system.color}-600 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${system.performance}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{system.requests}</span>
                        <Button 
                          size="sm" 
                          className={`bg-gradient-to-r from-${system.color}-500 to-${system.color}-600 hover:opacity-90`}
                        >
                          Manage →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI Model Registry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">AI Model Management</h3>
                  <p className="text-gray-400 mb-4">Deploy, monitor, and optimize your AI models</p>
                  <Button 
                    onClick={() => onNavigate("/admin/ai-ml-center")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Access Model Registry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orchestration" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI Orchestration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Orchestration Engine</h3>
                  <p className="text-gray-400 mb-4">Coordinate AI workflows and resource allocation</p>
                  <Button 
                    onClick={() => onNavigate("/admin/ai-native-os")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Access Orchestration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI Performance Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Real-time Monitoring</h3>
                  <p className="text-gray-400 mb-4">Monitor AI performance and resource utilization</p>
                  <Button 
                    onClick={() => onNavigate("/analytics-intelligence")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Access Monitoring
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

export default AIIntelligenceCenter;