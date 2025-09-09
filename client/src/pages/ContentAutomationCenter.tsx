import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, FileText, MessageSquare, Rss, Globe, Brain,
  Camera, Video, Mic, Edit, Calendar, TrendingUp
} from "lucide-react";

interface ContentAutomationCenterProps {
  onNavigate: (path: string) => void;
}

const ContentAutomationCenter = ({ onNavigate }: ContentAutomationCenterProps) => {
  const [contentMetrics, setContentMetrics] = useState({
    contentGenerated: 1847,
    blogPosts: 324,
    socialPosts: 892,
    emailCampaigns: 156,
    videosProcessed: 67,
    contentViews: 284750,
    engagementRate: 8.4,
    automationActive: 23
  });

  const contentSystems = [
    {
      name: "Blog Content Engine",
      description: "AI-powered blog post generation and optimization",
      generated: "324 posts",
      status: "active",
      path: "/admin/content-feed",
      icon: FileText,
      color: "blue"
    },
    {
      name: "Social Media Automation",
      description: "Multi-platform social content scheduling",
      generated: "892 posts",
      status: "active", 
      path: "/admin/content-feed",
      icon: MessageSquare,
      color: "green"
    },
    {
      name: "Email Marketing Engine",
      description: "Automated email campaigns and newsletters",
      generated: "156 campaigns",
      status: "active",
      path: "/admin/notifications",
      icon: Rss,
      color: "purple"
    },
    {
      name: "Video Content Processor",
      description: "Automated video editing and optimization",
      generated: "67 videos",
      status: "active",
      path: "/content-automation",
      icon: Video,
      color: "red"
    },
    {
      name: "Content Feed Aggregator",
      description: "Multi-source content curation and syndication",
      generated: "2.1K items",
      status: "optimal",
      path: "/admin/content-feed",
      icon: Globe,
      color: "cyan"
    },
    {
      name: "AI Content Optimizer",
      description: "SEO and engagement optimization",
      generated: "98.7% score",
      status: "optimal",
      path: "/ai-intelligence",
      icon: Brain,
      color: "indigo"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "optimal": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
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
              <div className="p-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Content Automation Center
                </h1>
                <p className="text-gray-400">AI-powered content generation, marketing automation, and publishing</p>
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
            <TabsTrigger value="overview">Content Overview</TabsTrigger>
            <TabsTrigger value="generation">Content Generation</TabsTrigger>
            <TabsTrigger value="automation">Marketing Automation</TabsTrigger>
            <TabsTrigger value="analytics">Content Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Content Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Content Generated</p>
                      <p className="text-2xl font-bold text-pink-400">{contentMetrics.contentGenerated.toLocaleString()}</p>
                    </div>
                    <Zap className="h-8 w-8 text-pink-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Content Views</p>
                      <p className="text-2xl font-bold text-blue-400">{(contentMetrics.contentViews / 1000).toFixed(1)}K</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Blog Posts</p>
                      <p className="text-2xl font-bold text-green-400">{contentMetrics.blogPosts}</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Social Posts</p>
                      <p className="text-2xl font-bold text-purple-400">{contentMetrics.socialPosts}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Email Campaigns</p>
                      <p className="text-2xl font-bold text-cyan-400">{contentMetrics.emailCampaigns}</p>
                    </div>
                    <Rss className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Videos Processed</p>
                      <p className="text-2xl font-bold text-red-400">{contentMetrics.videosProcessed}</p>
                    </div>
                    <Video className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Engagement</p>
                      <p className="text-2xl font-bold text-yellow-400">{contentMetrics.engagementRate}%</p>
                    </div>
                    <Calendar className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Automations</p>
                      <p className="text-2xl font-bold text-indigo-400">{contentMetrics.automationActive}</p>
                    </div>
                    <Brain className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Systems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentSystems.map((system, index) => (
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
                    <CardTitle className="text-lg text-white group-hover:text-pink-400 transition-colors">
                      {system.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-3 text-sm">{system.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-400">{system.generated}</span>
                      <Button 
                        size="sm" 
                        className={`bg-gradient-to-r from-${system.color}-500 to-${system.color}-600 hover:opacity-90`}
                      >
                        Manage →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI Content Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Intelligent Content Creation</h3>
                  <p className="text-gray-400 mb-4">Generate high-quality content using advanced AI models</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <Button 
                      onClick={() => onNavigate("/admin/content-feed")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Blog Generator
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/ai-intelligence")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      AI Writer
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/content-feed")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Content Feeds
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Marketing Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Zap className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Automated Marketing Workflows</h3>
                  <p className="text-gray-400 mb-4">Schedule, publish, and optimize content across all channels</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <Button 
                      onClick={() => onNavigate("/admin/notifications")}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Rss className="mr-2 h-4 w-4" />
                      Email Automation
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/content-feed")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Social Automation
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/content-automation")}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Content Scheduler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Content Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Content Performance Insights</h3>
                  <p className="text-gray-400 mb-4">Track engagement, reach, and conversion metrics</p>
                  <Button 
                    onClick={() => onNavigate("/analytics-intelligence")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    View Content Analytics
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

export default ContentAutomationCenter;