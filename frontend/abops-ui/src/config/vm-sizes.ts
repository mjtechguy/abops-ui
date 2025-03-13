// VM size interface
export interface VMSize {
  id: string;
  name: string;
  cpu: number;
  memory: number; // in GB
  storage?: number; // in GB
  description?: string;
}

// VM size configuration by provider
export const vmSizesByProvider: Record<string, VMSize[]> = {
  // AWS instance types
  aws: [
    { id: 't3.small', name: 't3.small', cpu: 2, memory: 2, description: 'General purpose' },
    { id: 't3.medium', name: 't3.medium', cpu: 2, memory: 4, description: 'General purpose' },
    { id: 't3.large', name: 't3.large', cpu: 2, memory: 8, description: 'General purpose' },
    { id: 'm5.large', name: 'm5.large', cpu: 2, memory: 8, description: 'General purpose' },
    { id: 'm5.xlarge', name: 'm5.xlarge', cpu: 4, memory: 16, description: 'General purpose' },
    { id: 'm5.2xlarge', name: 'm5.2xlarge', cpu: 8, memory: 32, description: 'General purpose' },
    { id: 'c5.large', name: 'c5.large', cpu: 2, memory: 4, description: 'Compute optimized' },
    { id: 'c5.xlarge', name: 'c5.xlarge', cpu: 4, memory: 8, description: 'Compute optimized' },
    { id: 'c5.2xlarge', name: 'c5.2xlarge', cpu: 8, memory: 16, description: 'Compute optimized' },
  ],
  
  // GCP machine types
  gcp: [
    { id: 'e2-small', name: 'e2-small', cpu: 2, memory: 2, description: 'General purpose' },
    { id: 'e2-medium', name: 'e2-medium', cpu: 2, memory: 4, description: 'General purpose' },
    { id: 'e2-standard-2', name: 'e2-standard-2', cpu: 2, memory: 8, description: 'General purpose' },
    { id: 'e2-standard-4', name: 'e2-standard-4', cpu: 4, memory: 16, description: 'General purpose' },
    { id: 'e2-standard-8', name: 'e2-standard-8', cpu: 8, memory: 32, description: 'General purpose' },
    { id: 'c2-standard-4', name: 'c2-standard-4', cpu: 4, memory: 16, description: 'Compute optimized' },
    { id: 'c2-standard-8', name: 'c2-standard-8', cpu: 8, memory: 32, description: 'Compute optimized' },
  ],
  
  // Azure VM sizes
  azure: [
    { id: 'Standard_B2s', name: 'Standard_B2s', cpu: 2, memory: 4, description: 'Burstable' },
    { id: 'Standard_B2ms', name: 'Standard_B2ms', cpu: 2, memory: 8, description: 'Burstable' },
    { id: 'Standard_D2s_v3', name: 'Standard_D2s_v3', cpu: 2, memory: 8, description: 'General purpose' },
    { id: 'Standard_D4s_v3', name: 'Standard_D4s_v3', cpu: 4, memory: 16, description: 'General purpose' },
    { id: 'Standard_D8s_v3', name: 'Standard_D8s_v3', cpu: 8, memory: 32, description: 'General purpose' },
    { id: 'Standard_F2s_v2', name: 'Standard_F2s_v2', cpu: 2, memory: 4, description: 'Compute optimized' },
    { id: 'Standard_F4s_v2', name: 'Standard_F4s_v2', cpu: 4, memory: 8, description: 'Compute optimized' },
  ],
  
  // DigitalOcean droplet sizes
  digitalocean: [
    { id: 's-2vcpu-2gb', name: 'Basic: 2 vCPU, 2GB RAM', cpu: 2, memory: 2, description: 'Basic' },
    { id: 's-2vcpu-4gb', name: 'Basic: 2 vCPU, 4GB RAM', cpu: 2, memory: 4, description: 'Basic' },
    { id: 's-4vcpu-8gb', name: 'Basic: 4 vCPU, 8GB RAM', cpu: 4, memory: 8, description: 'Basic' },
    { id: 'c-2', name: 'CPU-Optimized: 2 vCPU, 4GB RAM', cpu: 2, memory: 4, description: 'CPU Optimized' },
    { id: 'c-4', name: 'CPU-Optimized: 4 vCPU, 8GB RAM', cpu: 4, memory: 8, description: 'CPU Optimized' },
    { id: 'g-2vcpu-8gb', name: 'General Purpose: 2 vCPU, 8GB RAM', cpu: 2, memory: 8, description: 'General Purpose' },
    { id: 'g-4vcpu-16gb', name: 'General Purpose: 4 vCPU, 16GB RAM', cpu: 4, memory: 16, description: 'General Purpose' },
  ],
  
  // Oracle Cloud VM shapes
  oracle: [
    { id: 'VM.Standard.E3.Flex.2.8', name: 'VM.Standard.E3.Flex (2 OCPU, 8GB RAM)', cpu: 2, memory: 8, description: 'Standard' },
    { id: 'VM.Standard.E3.Flex.4.16', name: 'VM.Standard.E3.Flex (4 OCPU, 16GB RAM)', cpu: 4, memory: 16, description: 'Standard' },
    { id: 'VM.Standard.E3.Flex.8.32', name: 'VM.Standard.E3.Flex (8 OCPU, 32GB RAM)', cpu: 8, memory: 32, description: 'Standard' },
    { id: 'VM.Standard.E4.Flex.2.8', name: 'VM.Standard.E4.Flex (2 OCPU, 8GB RAM)', cpu: 2, memory: 8, description: 'Standard' },
    { id: 'VM.Standard.E4.Flex.4.16', name: 'VM.Standard.E4.Flex (4 OCPU, 16GB RAM)', cpu: 4, memory: 16, description: 'Standard' },
  ],
  
  // Hetzner server types
  hetzner: [
    { id: 'cx11', name: 'CX11 (1 vCPU, 2GB RAM)', cpu: 1, memory: 2, description: 'Standard' },
    { id: 'cx21', name: 'CX21 (2 vCPU, 4GB RAM)', cpu: 2, memory: 4, description: 'Standard' },
    { id: 'cx31', name: 'CX31 (2 vCPU, 8GB RAM)', cpu: 2, memory: 8, description: 'Standard' },
    { id: 'cx41', name: 'CX41 (4 vCPU, 16GB RAM)', cpu: 4, memory: 16, description: 'Standard' },
    { id: 'cx51', name: 'CX51 (8 vCPU, 32GB RAM)', cpu: 8, memory: 32, description: 'Standard' },
    { id: 'ccx11', name: 'CCX11 (2 vCPU, 8GB RAM)', cpu: 2, memory: 8, description: 'Dedicated CPU' },
    { id: 'ccx21', name: 'CCX21 (4 vCPU, 16GB RAM)', cpu: 4, memory: 16, description: 'Dedicated CPU' },
  ],
};

// Default custom VM size options for HCI providers
export const defaultHciSizes: VMSize[] = [
  { id: 'small', name: 'Small', cpu: 2, memory: 4, storage: 40, description: 'Small workloads' },
  { id: 'medium', name: 'Medium', cpu: 4, memory: 8, storage: 60, description: 'Medium workloads' },
  { id: 'large', name: 'Large', cpu: 8, memory: 16, storage: 100, description: 'Large workloads' },
  { id: 'xlarge', name: 'X-Large', cpu: 16, memory: 32, storage: 200, description: 'Extra large workloads' },
];

// Get VM sizes for a provider
export const getVMSizesForProvider = (providerId: string): VMSize[] => {
  // For cloud providers, return predefined sizes
  if (vmSizesByProvider[providerId]) {
    return vmSizesByProvider[providerId];
  }
  
  // For HCI providers, return default sizes that can be customized
  return defaultHciSizes;
};

// Node pool configuration
export interface NodePool {
  name: string;
  role: 'control-plane' | 'worker';
  count: number;
  vmSize: string;
  // For HCI providers
  customSize?: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

// Default node pool configurations
export const getDefaultNodePools = (providerId: string): NodePool[] => {
  const isHciProvider = ['harvester', 'vmware', 'proxmox'].includes(providerId);
  const defaultVmSize = isHciProvider 
    ? 'medium' 
    : getVMSizesForProvider(providerId)[0]?.id || '';
  
  return [
    {
      name: 'control-plane',
      role: 'control-plane',
      count: 1,
      vmSize: defaultVmSize,
      ...(isHciProvider && { 
        customSize: { 
          cpu: 2, 
          memory: 4, 
          storage: 40 
        } 
      })
    },
    {
      name: 'worker',
      role: 'worker',
      count: 2,
      vmSize: defaultVmSize,
      ...(isHciProvider && { 
        customSize: { 
          cpu: 4, 
          memory: 8, 
          storage: 60 
        } 
      })
    }
  ];
};
