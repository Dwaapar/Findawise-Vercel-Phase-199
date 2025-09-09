import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Key, 
  Zap, 
  Activity, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  TestTube,
  TrendingUp,
  AlertCircle,
  Cpu,
  Globe,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'cohere' | 'huggingface' | 'ollama' | 'custom';
  apiKey: string;
  endpoint?: string;
  model: string;
  maxTokens: number;
  isActive: boolean;
  priority: number;
  rateLimitRPM: number;
  rateLimitTPM: number;
  currentUsage: {
    tokensUsed: number;
    requestsUsed: number;
    resetTime: string;
  };
  isConnected: boolean;
  lastHealthCheck: string;
  fallbackEnabled: boolean;
}

interface ProviderStatus {
  id: string;
  status: 'healthy' | 'degraded' | 'critical' | 'exhausted';
  responseTime: number;
  errorRate: number;
  tokensRemaining: number;
  lastUsed: string;
}

interface SystemStats {
  totalProviders: number;
  activeProviders: number;
  totalRequests24h: number;
  totalTokens24h: number;
  averageResponseTime: number;
  errorRate: number;
  currentCostPer1kTokens: number;
  estimatedMonthlyCost: number;
}

export default function AIBrainInjector() {
  const [selectedTab, setSelectedTab] = useState('providers');
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch providers
  const { data: providersData, isLoading } = useQuery({
    queryKey: ['/api/llm-brain/providers'],
    refetchInterval: 10000,
  });

  // Fetch provider status
  const { data: statusData } = useQuery({
    queryKey: ['/api/llm-brain/status'],
    refetchInterval: 5000,
  });

  // Fetch system stats
  const { data: statsData } = useQuery({
    queryKey: ['/api/llm-brain/stats'],
    refetchInterval: 30000,
  });

  // Add provider mutation
  const addProviderMutation = useMutation({
    mutationFn: async (provider: Partial<AIProvider>) => {
      const response = await fetch('/api/llm-brain/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provider),
      });
      if (!response.ok) throw new Error('Failed to add provider');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Provider Added',
        description: 'AI provider has been added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/llm-brain/providers'] });
    },
  });

  // Update provider mutation
  const updateProviderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AIProvider> }) => {
      const response = await fetch(`/api/llm-brain/providers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update provider');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/llm-brain/providers'] });
    },
  });

  // Delete provider mutation
  const deleteProviderMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/llm-brain/providers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete provider');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Provider Removed',
        description: 'AI provider has been removed successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/llm-brain/providers'] });
    },
  });

  // Test provider mutation
  const testProviderMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/llm-brain/providers/${id}/test`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Provider test failed');
      return response.json();
    },
    onSuccess: (data, id) => {
      toast({
        title: 'Test Successful',
        description: `Provider ${id} is working correctly`,
      });
      setTestingProvider(null);
    },
    onError: (error, id) => {
      toast({
        title: 'Test Failed',
        description: `Provider ${id} test failed: ${error.message}`,
        variant: 'destructive',
      });
      setTestingProvider(null);
    },
  });

  const providers: AIProvider[] = providersData?.data || [];
  const providerStatuses: ProviderStatus[] = statusData?.data || [];
  const systemStats: SystemStats = statsData?.data || {};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'exhausted': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'exhausted': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const AddProviderForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'openai' as AIProvider['type'],
      apiKey: '',
      endpoint: '',
      model: '',
      maxTokens: 2048,
      priority: 1,
      rateLimitRPM: 3500,
      rateLimitTPM: 90000,
      fallbackEnabled: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addProviderMutation.mutate(formData);
      setFormData({
        name: '',
        type: 'openai',
        apiKey: '',
        endpoint: '',
        model: '',
        maxTokens: 2048,
        priority: 1,
        rateLimitRPM: 3500,
        rateLimitTPM: 90000,
        fallbackEnabled: true,
      });
    };

    const getDefaultModel = (type: string) => {
      switch (type) {
        case 'openai': return 'gpt-4';
        case 'anthropic': return 'claude-3-sonnet-20240229';
        case 'google': return 'gemini-pro';
        case 'cohere': return 'command-r-plus';
        case 'huggingface': return 'meta-llama/Llama-2-70b-chat-hf';
        case 'ollama': return 'llama2';
        default: return '';
      }
    };

    const getDefaultEndpoint = (type: string) => {
      switch (type) {
        case 'openai': return 'https://api.openai.com/v1';
        case 'anthropic': return 'https://api.anthropic.com';
        case 'google': return 'https://generativelanguage.googleapis.com';
        case 'cohere': return 'https://api.cohere.ai';
        case 'huggingface': return 'https://api-inference.huggingface.co';
        case 'ollama': return 'http://localhost:11434';
        default: return '';
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New AI Provider</span>
          </CardTitle>
          <CardDescription>
            Inject new AI providers into your brain system with automatic fallback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Provider Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., OpenAI GPT-4 Primary"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Provider Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    const newType = value as AIProvider['type'];
                    setFormData({
                      ...formData,
                      type: newType,
                      model: getDefaultModel(newType),
                      endpoint: getDefaultEndpoint(newType),
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                    <SelectItem value="google">Google (Gemini)</SelectItem>
                    <SelectItem value="cohere">Cohere</SelectItem>
                    <SelectItem value="huggingface">HuggingFace</SelectItem>
                    <SelectItem value="ollama">Ollama (Local)</SelectItem>
                    <SelectItem value="custom">Custom Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Enter your API key"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="API endpoint URL"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Model name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                  min="1"
                  max="100000"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority (1-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="rateLimitRPM">Rate Limit (RPM)</Label>
                <Input
                  id="rateLimitRPM"
                  type="number"
                  value={formData.rateLimitRPM}
                  onChange={(e) => setFormData({ ...formData, rateLimitRPM: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="fallbackEnabled"
                checked={formData.fallbackEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, fallbackEnabled: checked })}
              />
              <Label htmlFor="fallbackEnabled">Enable as fallback provider</Label>
            </div>

            <Button type="submit" disabled={addProviderMutation.isPending} className="w-full">
              {addProviderMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adding Provider...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading AI Brain Injector...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">AI Brain Injector</h1>
            <p className="text-gray-600">Manage multiple AI providers with automatic token fallback</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            {showApiKeys ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="text-sm">Show API Keys</span>
            <Switch
              checked={showApiKeys}
              onCheckedChange={setShowApiKeys}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/llm-brain/providers'] })}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Providers</p>
                <p className="text-2xl font-bold">{systemStats.activeProviders || 0}/{systemStats.totalProviders || 0}</p>
              </div>
              <Cpu className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">24h Requests</p>
                <p className="text-2xl font-bold">{(systemStats.totalRequests24h || 0).toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{systemStats.averageResponseTime || 0}ms</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="text-2xl font-bold">${(systemStats.estimatedMonthlyCost || 0).toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Alert */}
      {systemStats.errorRate > 0.1 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High error rate detected ({(systemStats.errorRate * 100).toFixed(1)}%). 
            Check provider configurations and rate limits.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="add">Add Provider</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid gap-4">
            {providers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No AI Providers Configured</h3>
                  <p className="text-gray-600 mb-4">
                    Add your first AI provider to start using the brain injection system
                  </p>
                  <Button onClick={() => setSelectedTab('add')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Provider
                  </Button>
                </CardContent>
              </Card>
            ) : (
              providers.map((provider) => {
                const status = providerStatuses.find(s => s.id === provider.id);
                return (
                  <Card key={provider.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status?.status || 'unknown')}`}>
                            {getStatusIcon(status?.status || 'unknown')}
                            <span className="capitalize">{status?.status || 'unknown'}</span>
                          </div>
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{provider.name}</span>
                              <Badge variant="outline">{provider.type}</Badge>
                              <Badge variant={provider.isActive ? 'default' : 'secondary'}>
                                Priority {provider.priority}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {provider.model} • Max {provider.maxTokens.toLocaleString()} tokens
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={provider.isActive}
                            onCheckedChange={(checked) => updateProviderMutation.mutate({
                              id: provider.id,
                              data: { isActive: checked }
                            })}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTestingProvider(provider.id);
                              testProviderMutation.mutate(provider.id);
                            }}
                            disabled={testingProvider === provider.id}
                          >
                            {testingProvider === provider.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <TestTube className="h-4 w-4 mr-2" />
                                Test
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProviderMutation.mutate(provider.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">API Configuration</p>
                          <div className="space-y-1">
                            <p className="text-xs">
                              <strong>Endpoint:</strong> {provider.endpoint || 'Default'}
                            </p>
                            <p className="text-xs">
                              <strong>API Key:</strong> {showApiKeys ? provider.apiKey : '••••••••••••••••'}
                            </p>
                            <p className="text-xs">
                              <strong>Fallback:</strong> {provider.fallbackEnabled ? 'Enabled' : 'Disabled'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Usage Limits</p>
                          <div className="space-y-1">
                            <p className="text-xs">
                              <strong>Rate Limit:</strong> {provider.rateLimitRPM} RPM
                            </p>
                            <p className="text-xs">
                              <strong>Token Limit:</strong> {provider.rateLimitTPM.toLocaleString()} TPM
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs">
                                <strong>Current Usage:</strong>
                              </p>
                              <Progress 
                                value={(provider.currentUsage.tokensUsed / provider.rateLimitTPM) * 100} 
                                className="h-2"
                              />
                              <p className="text-xs text-gray-500">
                                {provider.currentUsage.tokensUsed.toLocaleString()} / {provider.rateLimitTPM.toLocaleString()} tokens
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Performance</p>
                          <div className="space-y-1">
                            <p className="text-xs">
                              <strong>Response Time:</strong> {status?.responseTime || 0}ms
                            </p>
                            <p className="text-xs">
                              <strong>Error Rate:</strong> {((status?.errorRate || 0) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs">
                              <strong>Last Used:</strong> {status?.lastUsed ? new Date(status.lastUsed).toLocaleString() : 'Never'}
                            </p>
                            <p className="text-xs">
                              <strong>Health Check:</strong> {new Date(provider.lastHealthCheck).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="add">
          <AddProviderForm />
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>Provider Testing & Fallback Validation</span>
              </CardTitle>
              <CardDescription>
                Test individual providers and validate fallback chain functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => toast({ title: 'Testing all providers...', description: 'Running comprehensive tests' })}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Test All Providers
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast({ title: 'Testing fallback chain...', description: 'Validating automatic fallback' })}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Test Fallback Chain
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="testPrompt">Test Prompt</Label>
                  <Textarea
                    id="testPrompt"
                    placeholder="Enter a test prompt to validate providers..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Provider Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providers.map((provider) => {
                    const status = providerStatuses.find(s => s.id === provider.id);
                    return (
                      <div key={provider.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm font-medium">{provider.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{status?.responseTime || 0}ms</span>
                          <div className={`w-2 h-2 rounded-full ${status?.status === 'healthy' ? 'bg-green-500' : status?.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Rate per 1K tokens:</span>
                    <span className="font-bold">${(systemStats.currentCostPer1kTokens || 0).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tokens used today:</span>
                    <span className="font-bold">{(systemStats.totalTokens24h || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated monthly cost:</span>
                    <span className="font-bold text-green-600">${(systemStats.estimatedMonthlyCost || 0).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}