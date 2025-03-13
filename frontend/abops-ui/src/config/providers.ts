// Provider types
export type ProviderType = "cloud" | "hci";

// Provider interface
export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  logoPath: string;
}

// Get environment variable with fallback
const getEnvVar = (key: string, fallback: string): string => {
  if (typeof window !== 'undefined') {
    return process.env[key] || fallback;
  }
  return fallback;
};

// Base directory for provider logos
const logoBaseDir = getEnvVar('NEXT_PUBLIC_PROVIDER_LOGOS_DIR', '/abops/providers');

// Provider configuration
export const providers: Provider[] = [
  // Cloud Providers
  { 
    id: "aws", 
    name: "AWS", 
    type: "cloud", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_AWS', `${logoBaseDir}/aws.svg`) 
  },
  { 
    id: "gcp", 
    name: "Google Cloud", 
    type: "cloud", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_GCP', `${logoBaseDir}/gcp.svg`) 
  },
  { 
    id: "azure", 
    name: "Azure", 
    type: "cloud", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_AZURE', `${logoBaseDir}/azure.svg`) 
  },
  { 
    id: "digitalocean", 
    name: "DigitalOcean", 
    type: "cloud", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_DIGITALOCEAN', `${logoBaseDir}/digitalocean.svg`) 
  },
  { 
    id: "oracle", 
    name: "Oracle Cloud", 
    type: "cloud", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_ORACLE', `${logoBaseDir}/oracle.svg`) 
  },
  { 
    id: "hetzner", 
    name: "Hetzner", 
    type: "cloud", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_HETZNER', `${logoBaseDir}/hetzner.svg`) 
  },
  
  // HCI Providers
  { 
    id: "harvester", 
    name: "Harvester", 
    type: "hci", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_HARVESTER', `${logoBaseDir}/harvester.svg`) 
  },
  { 
    id: "vmware", 
    name: "VMware", 
    type: "hci", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_VMWARE', `${logoBaseDir}/vmware.svg`) 
  },
  { 
    id: "proxmox", 
    name: "Proxmox", 
    type: "hci", 
    logoPath: getEnvVar('NEXT_PUBLIC_LOGO_PROXMOX', `${logoBaseDir}/proxmox.svg`) 
  },
];

// Helper function to get providers by type
export const getProvidersByType = (type: ProviderType): Provider[] => {
  return providers.filter(provider => provider.type === type);
};

// Helper function to get a provider by ID
export const getProviderById = (id: string): Provider | undefined => {
  return providers.find(provider => provider.id === id);
};
