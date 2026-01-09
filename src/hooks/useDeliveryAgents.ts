import { useState, useEffect, useCallback } from 'react';
import { DeliveryAgent } from '@/types/admin';

const STORAGE_KEY = 'diom_delivery_agents';

const getInitialAgents = (): DeliveryAgent[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  // Sample data for demo
  const sampleAgents: DeliveryAgent[] = [
    {
      id: 'agent-1',
      name: 'Michael Johnson',
      email: 'michael@diom.com',
      phone: '+234 810 123 4567',
      vehicleType: 'motorcycle',
      vehiclePlate: 'LAG-123-AB',
      isAvailable: true,
      currentDeliveries: 2,
      maxDeliveries: 5,
      zone: 'Lagos Island',
      createdAt: '2024-06-15T10:00:00Z',
    },
    {
      id: 'agent-2',
      name: 'Sarah Adams',
      email: 'sarah@diom.com',
      phone: '+234 811 234 5678',
      vehicleType: 'car',
      vehiclePlate: 'LAG-456-CD',
      isAvailable: true,
      currentDeliveries: 1,
      maxDeliveries: 4,
      zone: 'Mainland',
      createdAt: '2024-07-20T10:00:00Z',
    },
    {
      id: 'agent-3',
      name: 'David Okonkwo',
      email: 'david@diom.com',
      phone: '+234 812 345 6789',
      vehicleType: 'van',
      vehiclePlate: 'LAG-789-EF',
      isAvailable: false,
      currentDeliveries: 3,
      maxDeliveries: 3,
      zone: 'Lekki/Ajah',
      createdAt: '2024-08-10T10:00:00Z',
    },
    {
      id: 'agent-4',
      name: 'Grace Nnamdi',
      email: 'grace@diom.com',
      phone: '+234 813 456 7890',
      vehicleType: 'motorcycle',
      vehiclePlate: 'LAG-012-GH',
      isAvailable: true,
      currentDeliveries: 0,
      maxDeliveries: 5,
      zone: 'Ikeja/Maryland',
      createdAt: '2024-09-05T10:00:00Z',
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleAgents));
  return sampleAgents;
};

export const useDeliveryAgents = () => {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAgents(getInitialAgents());
    setIsLoading(false);
  }, []);

  const saveAgents = useCallback((newAgents: DeliveryAgent[]) => {
    setAgents(newAgents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents));
  }, []);

  const createAgent = useCallback((agentData: Omit<DeliveryAgent, 'id' | 'createdAt' | 'currentDeliveries'>): DeliveryAgent => {
    const newAgent: DeliveryAgent = {
      ...agentData,
      id: crypto.randomUUID(),
      currentDeliveries: 0,
      createdAt: new Date().toISOString(),
    };

    const newAgents = [newAgent, ...agents];
    saveAgents(newAgents);
    return newAgent;
  }, [agents, saveAgents]);

  const updateAgent = useCallback((agentId: string, updates: Partial<DeliveryAgent>) => {
    const newAgents = agents.map(agent => {
      if (agent.id !== agentId) return agent;
      return { ...agent, ...updates };
    });

    saveAgents(newAgents);
  }, [agents, saveAgents]);

  const deleteAgent = useCallback((agentId: string) => {
    const newAgents = agents.filter(a => a.id !== agentId);
    saveAgents(newAgents);
  }, [agents, saveAgents]);

  const toggleAvailability = useCallback((agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      updateAgent(agentId, { isAvailable: !agent.isAvailable });
    }
  }, [agents, updateAgent]);

  const incrementDeliveryCount = useCallback((agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent && agent.currentDeliveries < agent.maxDeliveries) {
      updateAgent(agentId, { 
        currentDeliveries: agent.currentDeliveries + 1,
        isAvailable: agent.currentDeliveries + 1 < agent.maxDeliveries,
      });
    }
  }, [agents, updateAgent]);

  const decrementDeliveryCount = useCallback((agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent && agent.currentDeliveries > 0) {
      updateAgent(agentId, { 
        currentDeliveries: agent.currentDeliveries - 1,
        isAvailable: true,
      });
    }
  }, [agents, updateAgent]);

  const getAvailableAgents = useCallback(() => {
    return agents.filter(a => a.isAvailable && a.currentDeliveries < a.maxDeliveries);
  }, [agents]);

  return {
    agents,
    isLoading,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAvailability,
    incrementDeliveryCount,
    decrementDeliveryCount,
    getAvailableAgents,
  };
};
