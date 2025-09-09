import { useQuery } from '@tanstack/react-query';

// Custom hook for system pulse data
export const useSystemPulse = () => {
  return useQuery({
    queryKey: ['system-pulse'],
    queryFn: async () => {
      const response = await fetch('/api/system-pulse');
      if (!response.ok) {
        throw new Error('Failed to fetch system pulse');
      }
      return response.json();
    },
    refetchInterval: 2000,
    staleTime: 1000,
    cacheTime: 5000
  });
};

// Custom hook for neurons data
export const useNeurons = () => {
  return useQuery({
    queryKey: ['neurons'],
    queryFn: async () => {
      const response = await fetch('/api/federation/neurons');
      if (!response.ok) {
        throw new Error('Failed to fetch neurons');
      }
      return response.json();
    },
    refetchInterval: 5000,
    staleTime: 2000,
    cacheTime: 10000
  });
};

// Custom hook for AI brain log
export const useAIBrainLog = () => {
  return useQuery({
    queryKey: ['ai-brain-log'],
    queryFn: async () => {
      const response = await fetch('/api/ai-brain/recent-decisions');
      if (!response.ok) {
        throw new Error('Failed to fetch AI brain log');
      }
      return response.json();
    },
    refetchInterval: 3000,
    staleTime: 1500,
    cacheTime: 8000
  });
};

// Custom hook for UI configuration
export const useUIConfig = () => {
  return useQuery({
    queryKey: ['ui-config'],
    queryFn: async () => {
      const response = await fetch('/api/ui/config');
      if (!response.ok) {
        throw new Error('Failed to fetch UI config');
      }
      return response.json();
    },
    staleTime: 60000, // UI config changes less frequently
    cacheTime: 300000
  });
};

// Custom hook for real-time metrics stream
export const useMetricsStream = () => {
  return useQuery({
    queryKey: ['metrics-stream'],
    queryFn: async () => {
      // For real-time data, we'll use Server-Sent Events
      return new Promise((resolve, reject) => {
        const eventSource = new EventSource('/api/metrics/stream');
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        };
        
        eventSource.onerror = (error) => {
          eventSource.close();
          reject(error);
        };
        
        // Close connection after 30 seconds to prevent memory leaks
        setTimeout(() => {
          eventSource.close();
        }, 30000);
      });
    },
    refetchInterval: 2000,
    enabled: false // Enable only when needed
  });
};

// Emotion detection hook
export const useEmotionDetection = () => {
  const detectEmotion = async (data: {
    scrollBehavior: string;
    location: string;
    timeOnPage: number;
    clickPattern?: any;
  }) => {
    const response = await fetch('/api/emotion/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': sessionStorage.getItem('sessionId') || 'anonymous'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to detect emotion');
    }
    
    return response.json();
  };

  return { detectEmotion };
};

// System health hook
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error('Failed to fetch system health');
      }
      return response.json();
    },
    refetchInterval: 5000,
    staleTime: 2000
  });
};

// Database health hook
export const useDatabaseHealth = () => {
  return useQuery({
    queryKey: ['database-health'],
    queryFn: async () => {
      const response = await fetch('/api/db-health');
      if (!response.ok) {
        throw new Error('Failed to fetch database health');
      }
      return response.json();
    },
    refetchInterval: 10000,
    staleTime: 5000
  });
};