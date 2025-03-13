// Types for Rancher Management Server credentials
import { rancherServersService, rancherCredentialsService, RancherServerData, RancherCredentialData } from '@/services/credentials';

export interface RancherServer {
  id: string;
  name: string;
  address: string;
  description?: string;
  createdAt: string;
}

export interface RancherCredential {
  id: string;
  serverId: string;
  username: string;
  password?: string;
  token?: string;
  isDefault?: boolean;
  createdAt: string;
}

// Mock data for Rancher servers
export const rancherServers: RancherServer[] = [
  {
    id: 'rancher-prod',
    name: 'Production Rancher',
    address: 'https://rancher.prod.example.com',
    description: 'Production Rancher management server',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'rancher-staging',
    name: 'Staging Rancher',
    address: 'https://rancher.staging.example.com',
    description: 'Staging environment Rancher management server',
    createdAt: '2025-01-20T10:30:00Z',
  },
  {
    id: 'rancher-dev',
    name: 'Development Rancher',
    address: 'https://rancher.dev.example.com',
    description: 'Development environment Rancher management server',
    createdAt: '2025-02-05T14:15:00Z',
  }
];

// Mock data for Rancher credentials
export const rancherCredentials: RancherCredential[] = [
  {
    id: 'rancher-cred-1',
    serverId: 'rancher-prod',
    username: 'admin',
    password: 'password123',
    isDefault: true,
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'rancher-cred-2',
    serverId: 'rancher-staging',
    username: 'admin',
    password: 'password123',
    isDefault: true,
    createdAt: '2025-01-20T11:00:00Z',
  },
  {
    id: 'rancher-cred-3',
    serverId: 'rancher-dev',
    username: 'admin',
    token: 'token123456',
    isDefault: true,
    createdAt: '2025-02-05T15:00:00Z',
  }
];

// Convert database server to application server
const mapDbServerToRancherServer = (dbServer: RancherServerData): RancherServer => {
  return {
    id: dbServer.id || '',
    name: dbServer.name,
    address: dbServer.address,
    description: dbServer.description,
    createdAt: dbServer.created_at || new Date().toISOString()
  };
};

// Convert database credential to application credential
const mapDbCredentialToRancherCredential = (dbCred: RancherCredentialData): RancherCredential => {
  return {
    id: dbCred.id || '',
    serverId: dbCred.server_id,
    username: dbCred.username,
    password: dbCred.password,
    token: dbCred.token,
    isDefault: dbCred.is_default,
    createdAt: dbCred.created_at || new Date().toISOString()
  };
};

// Helper functions
export const getRancherServerById = async (id: string): Promise<RancherServer | undefined> => {
  try {
    const dbServer = await rancherServersService.getById(id);
    return mapDbServerToRancherServer(dbServer);
  } catch (error) {
    console.error(`Error fetching Rancher server with ID ${id} from database:`, error);
    // Fallback to mock data
    return rancherServers.find(server => server.id === id);
  }
};

export const getCredentialsForServer = async (serverId: string): Promise<RancherCredential[]> => {
  try {
    const dbCredentials = await rancherCredentialsService.getByServerId(serverId);
    return dbCredentials.map(mapDbCredentialToRancherCredential);
  } catch (error) {
    console.error(`Error fetching credentials for server ${serverId} from database:`, error);
    // Fallback to mock data
    return rancherCredentials.filter(cred => cred.serverId === serverId);
  }
};

export const getAllRancherServers = async (): Promise<RancherServer[]> => {
  try {
    const dbServers = await rancherServersService.getAll();
    return dbServers.map(mapDbServerToRancherServer);
  } catch (error) {
    console.error('Error fetching Rancher servers from database:', error);
    // Fallback to mock data
    return rancherServers;
  }
};

export const getDefaultCredentialForServer = async (serverId: string): Promise<RancherCredential | undefined> => {
  try {
    const dbCredential = await rancherCredentialsService.getDefaultForServer(serverId);
    return dbCredential ? mapDbCredentialToRancherCredential(dbCredential) : undefined;
  } catch (error) {
    console.error(`Error fetching default credential for server ${serverId} from database:`, error);
    // Fallback to mock data
    return rancherCredentials.find(cred => cred.serverId === serverId && cred.isDefault);
  }
};
