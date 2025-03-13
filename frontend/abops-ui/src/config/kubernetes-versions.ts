// Kubernetes distribution types
export type KubernetesDistribution = 
  | 'EKS'      // Amazon Elastic Kubernetes Service
  | 'AKS'      // Azure Kubernetes Service
  | 'GKE'      // Google Kubernetes Engine
  | 'DOK8s'    // DigitalOcean Kubernetes
  | 'OKE'      // Oracle Container Engine for Kubernetes
  | 'RKE2'     // Rancher Kubernetes Engine 2
  | 'K3s'      // Lightweight Kubernetes
  | 'Vanilla'  // Vanilla Kubernetes

// Interface for Kubernetes version
export interface KubernetesVersion {
  version: string;
  isDefault?: boolean;
  endOfLife?: string;  // ISO date string when this version reaches EOL
  deprecated?: boolean;
}

// Interface for Kubernetes distribution
export interface KubernetesDistributionOption {
  id: KubernetesDistribution;
  name: string;
  description: string;
  versions: KubernetesVersion[];
  isDefault?: boolean;
}

// Map of provider IDs to their default/supported Kubernetes distributions
export const providerToDistributions: Record<string, KubernetesDistributionOption[]> = {
  // AWS supports EKS (managed) or self-managed options
  'aws': [
    {
      id: 'EKS',
      name: 'Amazon EKS',
      description: 'Amazon Elastic Kubernetes Service - Managed Kubernetes',
      isDefault: true,
      versions: [
        { version: '1.29', isDefault: true },
        { version: '1.28' },
        { version: '1.27' },
        { version: '1.26' },
        { version: '1.25', deprecated: true },
      ]
    },
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2 - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'Vanilla',
      name: 'Vanilla Kubernetes',
      description: 'Standard Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ],
  
  // Azure supports AKS (managed) or self-managed options
  'azure': [
    {
      id: 'AKS',
      name: 'Azure AKS',
      description: 'Azure Kubernetes Service - Managed Kubernetes',
      isDefault: true,
      versions: [
        { version: '1.29.0', isDefault: true },
        { version: '1.28.5' },
        { version: '1.27.9' },
        { version: '1.26.12' },
        { version: '1.25.16', deprecated: true },
      ]
    },
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2 - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'Vanilla',
      name: 'Vanilla Kubernetes',
      description: 'Standard Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ],
  
  // GCP supports GKE (managed) or self-managed options
  'gcp': [
    {
      id: 'GKE',
      name: 'Google GKE',
      description: 'Google Kubernetes Engine - Managed Kubernetes',
      isDefault: true,
      versions: [
        { version: '1.29.0', isDefault: true },
        { version: '1.28.5' },
        { version: '1.27.9' },
        { version: '1.26.12' },
        { version: '1.25.16', deprecated: true },
      ]
    },
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2 - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'Vanilla',
      name: 'Vanilla Kubernetes',
      description: 'Standard Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ],
  
  // DigitalOcean supports DOKS (managed) or self-managed options
  'digitalocean': [
    {
      id: 'DOK8s',
      name: 'DigitalOcean Kubernetes',
      description: 'DigitalOcean Kubernetes Service - Managed Kubernetes',
      isDefault: true,
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.5' },
        { version: '1.27.9' },
        { version: '1.26.12' },
        { version: '1.25.16', deprecated: true },
      ]
    },
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2 - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ],
  
  // Oracle Cloud supports OKE (managed) or self-managed options
  'oracle': [
    {
      id: 'OKE',
      name: 'Oracle Container Engine',
      description: 'Oracle Container Engine for Kubernetes - Managed Kubernetes',
      isDefault: true,
      versions: [
        { version: '1.28.2', isDefault: true },
        { version: '1.27.6' },
        { version: '1.26.7' },
        { version: '1.25.11', deprecated: true },
      ]
    },
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2 - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'Vanilla',
      name: 'Vanilla Kubernetes',
      description: 'Standard Kubernetes - Self-managed',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ],
  
  // Hetzner only supports self-managed options
  'hetzner': [
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2',
      isDefault: true,
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'Vanilla',
      name: 'Vanilla Kubernetes',
      description: 'Standard Kubernetes',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ],
  
  // HCI providers (Harvester, VMware, Proxmox) support self-managed options
  'harvester': [
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2',
      isDefault: true,
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ],
  
  'vmware': [
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2',
      isDefault: true,
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'Vanilla',
      name: 'Vanilla Kubernetes',
      description: 'Standard Kubernetes',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ],
  
  'proxmox': [
    {
      id: 'RKE2',
      name: 'RKE2',
      description: 'Rancher Kubernetes Engine 2',
      isDefault: true,
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'K3s',
      name: 'K3s',
      description: 'Lightweight Kubernetes',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    },
    {
      id: 'Vanilla',
      name: 'Vanilla Kubernetes',
      description: 'Standard Kubernetes',
      versions: [
        { version: '1.29.1', isDefault: true },
        { version: '1.28.6' },
        { version: '1.27.10' },
        { version: '1.26.13' },
      ]
    }
  ]
};

// Helper function to get available distributions for a provider
export const getDistributionsForProvider = (providerId: string): KubernetesDistributionOption[] => {
  return providerToDistributions[providerId] || [];
};

// Helper function to get default distribution for a provider
export const getDefaultDistributionForProvider = (providerId: string): KubernetesDistributionOption | undefined => {
  const distributions = getDistributionsForProvider(providerId);
  return distributions.find(dist => dist.isDefault) || distributions[0];
};

// Helper function to get versions for a distribution
export const getVersionsForDistribution = (
  providerId: string, 
  distributionId: KubernetesDistribution
): KubernetesVersion[] => {
  const distributions = getDistributionsForProvider(providerId);
  const distribution = distributions.find(dist => dist.id === distributionId);
  return distribution?.versions || [];
};

// Helper function to get default version for a distribution
export const getDefaultVersionForDistribution = (
  providerId: string, 
  distributionId: KubernetesDistribution
): string => {
  const versions = getVersionsForDistribution(providerId, distributionId);
  const defaultVersion = versions.find(v => v.isDefault);
  return defaultVersion?.version || versions[0]?.version || '';
};
