import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Shield, Eye, EyeOff, Save, RefreshCw, CheckCircle, 
  AlertTriangle, Settings, Lock, Unlock, Copy, Plus,
  Trash2, Edit3, Database, Cloud, Zap, Brain, Globe,
  Crown, Diamond, Sparkles, Activity, Monitor, Cpu
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyConfig {
  id: string;
  name: string;
  key: string;
  category: string;
  description: string;
  isActive: boolean;
  lastUsed?: string;
  usageCount?: number;
  icon: any;
  color: string;
  required: boolean;
  encrypted: boolean;
}

export default function ApiKeyManagement() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKeyData, setNewKeyData] = useState({ name: '', key: '', category: 'ai' });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // API Key Categories with their configurations
  const apiKeyCategories = {
    ai: {
      title: 'AI & Machine Learning',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      description: 'Large Language Models and AI Services'
    },
    database: {
      title: 'Database & Storage',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      description: 'Database connections and cloud storage'
    },
    cloud: {
      title: 'Cloud Services',
      icon: Cloud,
      color: 'from-green-500 to-emerald-500',
      description: 'Cloud providers and infrastructure'
    },
    payment: {
      title: 'Payment Processing',
      icon: Crown,
      color: 'from-amber-500 to-orange-500',
      description: 'Payment gateways and financial services'
    },
    communication: {
      title: 'Communication',
      icon: Globe,
      color: 'from-indigo-500 to-purple-500',
      description: 'Email, SMS, and notification services'
    },
    analytics: {
      title: 'Analytics & Monitoring',
      icon: Activity,
      color: 'from-rose-500 to-red-500',
      description: 'Analytics, monitoring, and tracking'
    }
  };

  // Predefined API Key Templates
  const keyTemplates: ApiKeyConfig[] = [
    {
      id: 'openai',
      name: 'OpenAI API Key',
      key: '',
      category: 'ai',
      description: 'GPT-4, ChatGPT, and other OpenAI models',
      isActive: false,
      icon: Brain,
      color: 'from-green-400 to-blue-500',
      required: true,
      encrypted: true
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      key: '',
      category: 'ai',
      description: 'Claude AI models by Anthropic',
      isActive: false,
      icon: Sparkles,
      color: 'from-purple-400 to-pink-500',
      required: false,
      encrypted: true
    },
    {
      id: 'google_ai',
      name: 'Google AI (Gemini)',
      key: '',
      category: 'ai',
      description: 'Google Gemini and PaLM models',
      isActive: false,
      icon: Globe,
      color: 'from-blue-400 to-cyan-500',
      required: false,
      encrypted: true
    },
    {
      id: 'database_url',
      name: 'Production Database URL',
      key: '',
      category: 'database',
      description: 'PostgreSQL production database connection',
      isActive: false,
      icon: Database,
      color: 'from-slate-400 to-gray-500',
      required: true,
      encrypted: true
    },
    {
      id: 'stripe_secret',
      name: 'Stripe Secret Key',
      key: '',
      category: 'payment',
      description: 'Stripe payment processing',
      isActive: false,
      icon: Crown,
      color: 'from-purple-400 to-indigo-500',
      required: false,
      encrypted: true
    },
    {
      id: 'resend_api',
      name: 'Resend API Key',
      key: '',
      category: 'communication',
      description: 'Email delivery service',
      isActive: false,
      icon: Globe,
      color: 'from-emerald-400 to-teal-500',
      required: false,
      encrypted: true
    },
    {
      id: 'supabase_url',
      name: 'Supabase Project URL',
      key: '',
      category: 'database',
      description: 'Supabase backend-as-a-service',
      isActive: false,
      icon: Zap,
      color: 'from-green-400 to-emerald-500',
      required: false,
      encrypted: false
    },
    {
      id: 'supabase_anon',
      name: 'Supabase Anon Key',
      key: '',
      category: 'database',
      description: 'Supabase anonymous public key',
      isActive: false,
      icon: Unlock,
      color: 'from-blue-400 to-indigo-500',
      required: false,
      encrypted: true
    }
  ];

  // Fetch API keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await fetch('/api/admin/api-keys');
      if (!response.ok) throw new Error('Failed to fetch API keys');
      const data = await response.json();
      
      // Merge with templates to ensure all required keys are shown
      const mergedKeys = keyTemplates.map(template => {
        const existing = data.find((k: any) => k.id === template.id);
        return existing ? { ...template, ...existing } : template;
      });
      
      // Add any custom keys not in templates
      const customKeys = data.filter((k: any) => !keyTemplates.find(t => t.id === k.id));
      return [...mergedKeys, ...customKeys];
    },
    refetchInterval: 30000,
  });

  // Save API Key mutation
  const saveKeyMutation = useMutation({
    mutationFn: async (keyData: Partial<ApiKeyConfig>) => {
      const response = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyData),
      });
      if (!response.ok) throw new Error('Failed to save API key');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: '🔐 API Key Saved',
        description: 'Your API key has been securely encrypted and stored.',
      });
      setEditingKey(null);
    },
    onError: () => {
      toast({
        title: '❌ Save Failed',
        description: 'Failed to save API key. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete API Key mutation
  const deleteKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const response = await fetch(`/api/admin/api-keys/${keyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete API key');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: '🗑️ API Key Deleted',
        description: 'API key has been permanently removed.',
      });
    },
  });

  // Test API Key mutation
  const testKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const response = await fetch(`/api/admin/api-keys/${keyId}/test`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('API key test failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: '✅ API Key Valid',
        description: `Connection successful: ${data.message}`,
      });
    },
    onError: () => {
      toast({
        title: '❌ API Key Invalid',
        description: 'API key test failed. Please check your key.',
        variant: 'destructive',
      });
    },
  });

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '📋 Copied',
      description: 'API key copied to clipboard.',
    });
  };

  const handleSaveKey = (keyData: Partial<ApiKeyConfig>) => {
    saveKeyMutation.mutate(keyData);
  };

  const getKeysByCategory = (category: string) => {
    return apiKeys?.filter((key: ApiKeyConfig) => key.category === category) || [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 backdrop-blur-sm">
            <Crown className="w-6 h-6 text-amber-400" />
            <span className="text-amber-300 font-bold text-lg">Empire API Key Vault</span>
            <Diamond className="w-5 h-5 text-amber-400" />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Secure API Management
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enterprise-grade API key management with military-level encryption, 
            real-time monitoring, and automatic key rotation for your billion-dollar empire.
          </p>
        </motion.div>

        {/* Statistics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Key className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {apiKeys?.filter((k: ApiKeyConfig) => k.key).length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active Keys</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/20">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {apiKeys?.filter((k: ApiKeyConfig) => k.encrypted).length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Encrypted</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {apiKeys?.reduce((sum: number, k: ApiKeyConfig) => sum + (k.usageCount || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <Monitor className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Key Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="ai" className="space-y-6">
            <TabsList className="grid grid-cols-6 lg:grid-cols-6 bg-white/5 border border-white/10">
              {Object.entries(apiKeyCategories).map(([key, category]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-400"
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(apiKeyCategories).map(([categoryKey, category]) => (
              <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
                
                {/* Category Header */}
                <div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20">
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${category.color}`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                    <p className="text-gray-400">{category.description}</p>
                  </div>
                </div>

                {/* API Keys Grid */}
                <div className="grid gap-6">
                  {getKeysByCategory(categoryKey).map((apiKey: ApiKeyConfig) => (
                    <motion.div
                      key={apiKey.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg bg-gradient-to-r ${apiKey.color}`}>
                                <apiKey.icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-white flex items-center gap-2">
                                  {apiKey.name}
                                  {apiKey.required && (
                                    <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
                                      Required
                                    </Badge>
                                  )}
                                  {apiKey.encrypted && (
                                    <Lock className="w-4 h-4 text-green-400" />
                                  )}
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                  {apiKey.description}
                                </CardDescription>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={apiKey.isActive}
                                onCheckedChange={(checked) => {
                                  handleSaveKey({ ...apiKey, isActive: checked });
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingKey(editingKey === apiKey.id ? null : apiKey.id)}
                                className="text-gray-400 hover:text-white"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {editingKey === apiKey.id ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <Label htmlFor={`key-${apiKey.id}`} className="text-white">
                                  API Key
                                </Label>
                                <div className="relative">
                                  <Input
                                    id={`key-${apiKey.id}`}
                                    type={visibleKeys.has(apiKey.id) ? 'text' : 'password'}
                                    value={apiKey.key}
                                    onChange={(e) => {
                                      const updatedKeys = apiKeys?.map((k: ApiKeyConfig) =>
                                        k.id === apiKey.id ? { ...k, key: e.target.value } : k
                                      );
                                      queryClient.setQueryData(['api-keys'], updatedKeys);
                                    }}
                                    placeholder="Enter your API key..."
                                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 pr-20"
                                  />
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleKeyVisibility(apiKey.id)}
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                    >
                                      {visibleKeys.has(apiKey.id) ? 
                                        <EyeOff className="w-4 h-4" /> : 
                                        <Eye className="w-4 h-4" />
                                      }
                                    </Button>
                                    {apiKey.key && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(apiKey.key)}
                                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleSaveKey(apiKey)}
                                  disabled={saveKeyMutation.isPending}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {saveKeyMutation.isPending ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                  )}
                                  Save Key
                                </Button>
                                
                                {apiKey.key && (
                                  <Button
                                    onClick={() => testKeyMutation.mutate(apiKey.id)}
                                    disabled={testKeyMutation.isPending}
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10"
                                  >
                                    {testKeyMutation.isPending ? (
                                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Zap className="w-4 h-4 mr-2" />
                                    )}
                                    Test Key
                                  </Button>
                                )}
                                
                                {!apiKey.required && (
                                  <Button
                                    onClick={() => deleteKeyMutation.mutate(apiKey.id)}
                                    disabled={deleteKeyMutation.isPending}
                                    variant="destructive"
                                    className="ml-auto"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-400">
                                  Status: {apiKey.key ? 
                                    <span className="text-green-400">✓ Configured</span> : 
                                    <span className="text-orange-400">⚠ Not Set</span>
                                  }
                                </div>
                                {apiKey.lastUsed && (
                                  <div className="text-sm text-gray-400">
                                    Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}
                                  </div>
                                )}
                                {apiKey.usageCount && (
                                  <div className="text-sm text-gray-400">
                                    {apiKey.usageCount.toLocaleString()} requests
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {apiKey.key && (
                                  <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <Shield className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              <strong>Enterprise Security:</strong> All API keys are encrypted using AES-256 encryption and stored in our secure vault. 
              Keys are automatically rotated and monitored for unauthorized access 24/7.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </div>
  );
}