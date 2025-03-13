// Define types for credentials
import { providerCredentialsService, ProviderCredentialData } from '@/services/credentials';

export type CredentialType = 
  | 'aws'
  | 'azure'
  | 'gcp'
  | 'digitalocean'
  | 'oracle'
  | 'hetzner'
  | 'harvester'
  | 'vmware'
  | 'proxmox';

export interface Credential {
  id: string;
  name: string;
  type: CredentialType;
  description: string;
  createdAt: string;
  lastUsed?: string;
  data?: Record<string, string>;
}

// Mock credentials for demo purposes
// In a real app, these would be fetched from the database
export const mockCredentials: Credential[] = [
  {
    id: 'cred-aws-1',
    name: 'AWS Production',
    type: 'aws',
    description: 'Main AWS account for production workloads',
    createdAt: '2024-12-01T12:00:00Z',
    lastUsed: '2025-03-10T09:15:00Z'
  },
  {
    id: 'cred-aws-2',
    name: 'AWS Development',
    type: 'aws',
    description: 'Development AWS account',
    createdAt: '2024-12-02T14:30:00Z',
    lastUsed: '2025-03-12T11:20:00Z'
  },
  {
    id: 'cred-azure-1',
    name: 'Azure Main',
    type: 'azure',
    description: 'Primary Azure subscription',
    createdAt: '2024-12-03T09:45:00Z',
    lastUsed: '2025-03-11T15:30:00Z'
  },
  {
    id: 'cred-gcp-1',
    name: 'GCP Production',
    type: 'gcp',
    description: 'GCP production project',
    createdAt: '2024-12-05T16:20:00Z',
    lastUsed: '2025-03-09T10:45:00Z'
  },
  {
    id: 'cred-do-1',
    name: 'DigitalOcean Main',
    type: 'digitalocean',
    description: 'DigitalOcean account for web services',
    createdAt: '2024-12-10T11:15:00Z',
    lastUsed: '2025-03-08T14:20:00Z'
  },
  {
    id: 'cred-oracle-1',
    name: 'Oracle Cloud',
    type: 'oracle',
    description: 'Oracle Cloud Infrastructure account',
    createdAt: '2024-12-15T13:40:00Z'
  },
  {
    id: 'cred-vmware-1',
    name: 'VMware vSphere',
    type: 'vmware',
    description: 'On-premise VMware vSphere environment',
    createdAt: '2024-12-20T10:30:00Z',
    lastUsed: '2025-03-05T09:10:00Z'
  },
  {
    id: 'cred-proxmox-1',
    name: 'Proxmox Cluster',
    type: 'proxmox',
    description: 'Proxmox VE cluster for test environments',
    createdAt: '2024-12-25T15:50:00Z',
    lastUsed: '2025-03-01T16:45:00Z'
  }
];

// Convert database credential to application credential
const mapDbCredentialToCredential = (dbCred: ProviderCredentialData): Credential => {
  return {
    id: dbCred.id || '',
    name: dbCred.name,
    type: dbCred.provider,
    description: dbCred.description || '',
    createdAt: dbCred.created_at || new Date().toISOString(),
    data: dbCred.data
  };
};

// Helper functions
export const getCredentialsByType = async (type: CredentialType): Promise<Credential[]> => {
  try {
    const dbCredentials = await providerCredentialsService.getByProvider(type);
    return dbCredentials.map(mapDbCredentialToCredential);
  } catch (error) {
    console.error(`Error fetching ${type} credentials from database:`, error);
    // Fallback to mock data
    return mockCredentials.filter(cred => cred.type === type);
  }
};

export const getCredentialById = async (id: string): Promise<Credential | undefined> => {
  try {
    const dbCredential = await providerCredentialsService.getById(id);
    return mapDbCredentialToCredential(dbCredential);
  } catch (error) {
    console.error(`Error fetching credential with ID ${id} from database:`, error);
    // Fallback to mock data
    return mockCredentials.find(cred => cred.id === id);
  }
};

// In a real application, these functions would fetch from the database
export const fetchCredentialsFromDatabase = async (type?: CredentialType): Promise<Credential[]> => {
  try {
    if (type) {
      return await getCredentialsByType(type);
    } else {
      const dbCredentials = await providerCredentialsService.getAll();
      return dbCredentials.map(mapDbCredentialToCredential);
    }
  } catch (error) {
    console.error('Error fetching credentials from database:', error);
    // Fallback to mock data
    return type ? mockCredentials.filter(cred => cred.type === type) : mockCredentials;
  }
};

// Get default credential for a provider type
export const getDefaultCredentialForType = async (type: CredentialType): Promise<Credential | undefined> => {
  try {
    const credentials = await getCredentialsByType(type);
    // For now, just return the first credential as default
    return credentials.length > 0 ? credentials[0] : undefined;
  } catch (error) {
    console.error(`Error getting default credential for ${type}:`, error);
    // Fallback to mock data
    const credentials = mockCredentials.filter(cred => cred.type === type);
    return credentials.length > 0 ? credentials[0] : undefined;
  }
};
