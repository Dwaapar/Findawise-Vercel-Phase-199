import { useQuery } from '@tanstack/react-query';

// Hook for real-time empire stats
export const useEmpireStats = () => {
  return useQuery({
    queryKey: ['empire-stats'],
    queryFn: async () => {
      const response = await fetch('/api/federation/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch empire stats');
      }
      return response.json();
    },
    refetchInterval: 5000, // Update every 5 seconds
    staleTime: 2000,
  });
};

// Hook for workflow store data
export const useWorkflowStore = () => {
  return useQuery({
    queryKey: ['workflow-store'],
    queryFn: async () => {
      const response = await fetch('/api/storefront');
      if (!response.ok) {
        throw new Error('Failed to fetch workflow store');
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
};

// Hook for active AI agents
export const useActiveAgents = () => {
  return useQuery({
    queryKey: ['active-agents'],
    queryFn: async () => {
      const response = await fetch('/api/api-neurons');
      if (!response.ok) {
        throw new Error('Failed to fetch active agents');
      }
      return response.json();
    },
    refetchInterval: 10000, // Update every 10 seconds
    staleTime: 5000,
  });
};

// Hook for affiliate offers
export const useAffiliateOffers = () => {
  return useQuery({
    queryKey: ['affiliate-offers'],
    queryFn: async () => {
      const response = await fetch('/api/offer-engine/sources');
      if (!response.ok) {
        throw new Error('Failed to fetch affiliate offers');
      }
      return response.json();
    },
    staleTime: 60000, // 1 minute
  });
};

// Hook for system health and performance
export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/multi-region/system-health');
      if (!response.ok) {
        throw new Error('Failed to fetch system metrics');
      }
      return response.json();
    },
    refetchInterval: 15000, // Update every 15 seconds
    staleTime: 5000,
  });
};

// Hook for neuron services
export const useNeuronServices = () => {
  return useQuery({
    queryKey: ['neuron-services'],
    queryFn: async () => {
      const response = await fetch('/api/federation/neurons');
      if (!response.ok) {
        throw new Error('Failed to fetch neuron services');
      }
      return response.json();
    },
    refetchInterval: 20000, // Update every 20 seconds
    staleTime: 10000,
  });
};

// Hook for decision platform data
export const useDecisionPlatform = () => {
  return useQuery({
    queryKey: ['decision-platform'],
    queryFn: async () => {
      const response = await fetch('/api/semantic');
      if (!response.ok) {
        throw new Error('Failed to fetch decision platform data');
      }
      return response.json();
    },
    staleTime: 300000, // 5 minutes
  });
};

// Hook for real-time revenue metrics
export const useRevenueMetrics = () => {
  return useQuery({
    queryKey: ['revenue-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/revenue-split');
      if (!response.ok) {
        throw new Error('Failed to fetch revenue metrics');
      }
      return response.json();
    },
    refetchInterval: 30000, // Update every 30 seconds
    staleTime: 15000,
  });
};

// Hook for automation service stats
export const useAutomationStats = () => {
  return useQuery({
    queryKey: ['automation-stats'],
    queryFn: async () => {
      const response = await fetch('/api/funnel/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch automation stats');
      }
      return response.json();
    },
    refetchInterval: 20000,
    staleTime: 10000,
  });
};