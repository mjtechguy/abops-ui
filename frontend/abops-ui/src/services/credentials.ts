import { supabase } from '../lib/supabase/client';
import { CredentialType } from '@/config/credentials';
import { RancherCredential } from '@/config/rancher-servers';

// Provider credential interfaces
export interface ProviderCredentialData {
  id?: string;
  name: string;
  description?: string;
  provider: CredentialType;
  data: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  organization_id?: string;
}

// Rancher server interfaces
export interface RancherServerData {
  id?: string;
  name: string;
  address: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  organization_id?: string;
}

// Rancher credential interfaces
export interface RancherCredentialData {
  id?: string;
  server_id: string;
  name: string;
  username: string;
  password?: string;
  token?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  organization_id?: string;
}

// Provider credentials service
export const providerCredentialsService = {
  // Get all provider credentials
  async getAll() {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('provider_credentials')
      .select('*');
    
    if (error) {
      console.error('Error fetching provider credentials:', error);
      throw error;
    }
    
    return data as ProviderCredentialData[];
  },
  
  // Get provider credentials by provider type
  async getByProvider(provider: CredentialType) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('provider_credentials')
      .select('*')
      .eq('provider', provider);
    
    if (error) {
      console.error(`Error fetching ${provider} credentials:`, error);
      throw error;
    }
    
    return data as ProviderCredentialData[];
  },
  
  // Get provider credential by ID
  async getById(id: string) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('provider_credentials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching credential with ID ${id}:`, error);
      throw error;
    }
    
    return data as ProviderCredentialData;
  },
  
  // Create a new provider credential
  async create(credential: ProviderCredentialData) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('provider_credentials')
      .insert(credential)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating provider credential:', error);
      throw error;
    }
    
    return data as ProviderCredentialData;
  },
  
  // Update a provider credential
  async update(id: string, credential: Partial<ProviderCredentialData>) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('provider_credentials')
      .update(credential)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating credential with ID ${id}:`, error);
      throw error;
    }
    
    return data as ProviderCredentialData;
  },
  
  // Delete a provider credential
  async delete(id: string) {
    // Use the imported supabase client
    const { error } = await supabase
      .from('provider_credentials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting credential with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};

// Rancher servers service
export const rancherServersService = {
  // Get all Rancher servers
  async getAll() {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('rancher_servers')
      .select('*');
    
    if (error) {
      console.error('Error fetching Rancher servers:', error);
      throw error;
    }
    
    return data as RancherServerData[];
  },
  
  // Get Rancher server by ID
  async getById(id: string) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('rancher_servers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching Rancher server with ID ${id}:`, error);
      throw error;
    }
    
    return data as RancherServerData;
  },
  
  // Create a new Rancher server
  async create(server: RancherServerData) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('rancher_servers')
      .insert(server)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating Rancher server:', error);
      throw error;
    }
    
    return data as RancherServerData;
  },
  
  // Update a Rancher server
  async update(id: string, server: Partial<RancherServerData>) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('rancher_servers')
      .update(server)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating Rancher server with ID ${id}:`, error);
      throw error;
    }
    
    return data as RancherServerData;
  },
  
  // Delete a Rancher server
  async delete(id: string) {
    // Use the imported supabase client
    const { error } = await supabase
      .from('rancher_servers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting Rancher server with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};

// Rancher credentials service
export const rancherCredentialsService = {
  // Get all Rancher credentials
  async getAll() {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('rancher_credentials')
      .select('*');
    
    if (error) {
      console.error('Error fetching Rancher credentials:', error);
      throw error;
    }
    
    return data as RancherCredentialData[];
  },
  
  // Get Rancher credentials by server ID
  async getByServerId(serverId: string) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('rancher_credentials')
      .select('*')
      .eq('server_id', serverId);
    
    if (error) {
      console.error(`Error fetching credentials for server ${serverId}:`, error);
      throw error;
    }
    
    return data as RancherCredentialData[];
  },
  
  // Get Rancher credential by ID
  async getById(id: string) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('rancher_credentials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching Rancher credential with ID ${id}:`, error);
      throw error;
    }
    
    return data as RancherCredentialData;
  },
  
  // Get default credential for a server
  async getDefaultForServer(serverId: string) {
    // Use the imported supabase client
    const { data, error } = await supabase
      .from('rancher_credentials')
      .select('*')
      .eq('server_id', serverId)
      .eq('is_default', true)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error(`Error fetching default credential for server ${serverId}:`, error);
      throw error;
    }
    
    return data as RancherCredentialData | null;
  },
  
  // Create a new Rancher credential
  async create(credential: RancherCredentialData) {
    // Use the imported supabase client
    
    // If this credential is set as default, unset any existing defaults for this server
    if (credential.is_default) {
      await supabase
        .from('rancher_credentials')
        .update({ is_default: false })
        .eq('server_id', credential.server_id)
        .eq('is_default', true);
    }
    
    const { data, error } = await supabase
      .from('rancher_credentials')
      .insert(credential)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating Rancher credential:', error);
      throw error;
    }
    
    return data as RancherCredentialData;
  },
  
  // Update a Rancher credential
  async update(id: string, credential: Partial<RancherCredentialData>) {
    // Use the imported supabase client
    
    // If this credential is being set as default, unset any existing defaults for this server
    if (credential.is_default) {
      // First get the server_id for this credential
      const { data: existingCred } = await supabase
        .from('rancher_credentials')
        .select('server_id')
        .eq('id', id)
        .single();
      
      if (existingCred) {
        await supabase
          .from('rancher_credentials')
          .update({ is_default: false })
          .eq('server_id', existingCred.server_id)
          .eq('is_default', true)
          .neq('id', id);
      }
    }
    
    const { data, error } = await supabase
      .from('rancher_credentials')
      .update(credential)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating Rancher credential with ID ${id}:`, error);
      throw error;
    }
    
    return data as RancherCredentialData;
  },
  
  // Delete a Rancher credential
  async delete(id: string) {
    // Use the imported supabase client
    const { error } = await supabase
      .from('rancher_credentials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting Rancher credential with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  },
  
  // Set a credential as the default for a server
  async setAsDefault(id: string) {
    // Use the imported supabase client
    
    // First get the server_id for this credential
    const { data: credential, error: getError } = await supabase
      .from('rancher_credentials')
      .select('server_id')
      .eq('id', id)
      .single();
    
    if (getError) {
      console.error(`Error fetching credential with ID ${id}:`, getError);
      throw getError;
    }
    
    // Unset any existing defaults for this server
    await supabase
      .from('rancher_credentials')
      .update({ is_default: false })
      .eq('server_id', credential.server_id)
      .eq('is_default', true);
    
    // Set this credential as default
    const { data, error } = await supabase
      .from('rancher_credentials')
      .update({ is_default: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error setting credential ${id} as default:`, error);
      throw error;
    }
    
    return data as RancherCredentialData;
  }
};
