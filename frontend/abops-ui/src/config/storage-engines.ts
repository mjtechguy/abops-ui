// Storage engine types
export type StorageEngineType = 
  | 'CloudProvider'  // Use cloud provider's native storage (EBS, Azure Disk, etc.)
  | 'Longhorn'       // Rancher Longhorn
  | 'Portworx'       // Portworx Enterprise
  | 'OpenEBS'        // OpenEBS
  | 'Rook'           // Rook-Ceph

// Interface for storage engine
export interface StorageEngine {
  id: StorageEngineType;
  name: string;
  description: string;
  logo?: string;
  versions: string[];
  defaultVersion?: string;
  isDefault?: boolean;
  isAvailableForProvider: (providerId: string, k8sDistribution: string) => boolean;
}

// Storage engine options
export const storageEngines: StorageEngine[] = [
  {
    id: 'CloudProvider',
    name: 'Cloud Provider Storage',
    description: 'Use the native storage services of your cloud provider',
    versions: ['default'],
    defaultVersion: 'default',
    isDefault: true,
    isAvailableForProvider: (providerId, k8sDistribution) => {
      // Only available for cloud providers with managed K8s services
      return (
        (providerId === 'aws' && k8sDistribution === 'EKS') ||
        (providerId === 'azure' && k8sDistribution === 'AKS') ||
        (providerId === 'gcp' && k8sDistribution === 'GKE') ||
        (providerId === 'digitalocean' && k8sDistribution === 'DOK8s') ||
        (providerId === 'oracle' && k8sDistribution === 'OKE')
      );
    }
  },
  {
    id: 'Longhorn',
    name: 'Longhorn',
    description: 'Cloud-native distributed storage built on and for Kubernetes',
    logo: '/logos/longhorn.svg',
    versions: ['1.6.0', '1.5.3', '1.5.1', '1.4.3'],
    defaultVersion: '1.6.0',
    isDefault: false,
    isAvailableForProvider: () => true // Available for all providers
  },
  {
    id: 'Portworx',
    name: 'Portworx Enterprise',
    description: 'Container-native storage platform for running stateful workloads',
    logo: '/logos/portworx.svg',
    versions: ['3.1.0', '3.0.3', '2.13.5', '2.12.0'],
    defaultVersion: '3.1.0',
    isDefault: false,
    isAvailableForProvider: () => true // Available for all providers
  },
  {
    id: 'OpenEBS',
    name: 'OpenEBS',
    description: 'Leading open-source storage solution for Kubernetes',
    logo: '/logos/openebs.svg',
    versions: ['3.9.0', '3.8.0', '3.7.0', '3.6.0'],
    defaultVersion: '3.9.0',
    isDefault: false,
    isAvailableForProvider: () => true // Available for all providers
  },
  {
    id: 'Rook',
    name: 'Rook-Ceph',
    description: 'Production ready file, block, and object storage for Kubernetes',
    logo: '/logos/rook.svg',
    versions: ['1.12.3', '1.11.9', '1.10.13', '1.9.13'],
    defaultVersion: '1.12.3',
    isDefault: false,
    isAvailableForProvider: () => true // Available for all providers
  }
];

// Helper functions

// Get available storage engines for a provider and K8s distribution
export const getAvailableStorageEngines = (
  providerId: string, 
  k8sDistribution: string
): StorageEngine[] => {
  return storageEngines.filter(engine => 
    engine.isAvailableForProvider(providerId, k8sDistribution)
  );
};

// Get default storage engine for a provider and K8s distribution
export const getDefaultStorageEngine = (
  providerId: string, 
  k8sDistribution: string
): StorageEngine | undefined => {
  const availableEngines = getAvailableStorageEngines(providerId, k8sDistribution);
  
  // First try to find the cloud provider storage for managed K8s services
  if (
    (providerId === 'aws' && k8sDistribution === 'EKS') ||
    (providerId === 'azure' && k8sDistribution === 'AKS') ||
    (providerId === 'gcp' && k8sDistribution === 'GKE') ||
    (providerId === 'digitalocean' && k8sDistribution === 'DOK8s') ||
    (providerId === 'oracle' && k8sDistribution === 'OKE')
  ) {
    return availableEngines.find(engine => engine.id === 'CloudProvider');
  }
  
  // For self-managed K8s, default to Longhorn
  return availableEngines.find(engine => engine.id === 'Longhorn') || availableEngines[0];
};

// Get versions for a storage engine
export const getStorageEngineVersions = (engineId: StorageEngineType): string[] => {
  const engine = storageEngines.find(e => e.id === engineId);
  return engine?.versions || [];
};

// Get default version for a storage engine
export const getDefaultStorageEngineVersion = (engineId: StorageEngineType): string => {
  const engine = storageEngines.find(e => e.id === engineId);
  return engine?.defaultVersion || engine?.versions[0] || '';
};
