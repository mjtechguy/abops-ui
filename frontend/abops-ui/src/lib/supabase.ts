import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided');
}

// Log the Supabase URL for debugging
console.log('Connecting to Supabase at:', supabaseUrl);

// Create a simple fetch implementation that works reliably with Supabase
const simpleFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  // For debugging
  const urlString = url.toString();
  const isStorageRequest = urlString.includes('/storage/v1/');
  
  if (isStorageRequest) {
    console.log(`Storage API request to: ${urlString.split('?')[0]}`);
  }
  
  // Create headers with the necessary authorization
  const headers = new Headers(init?.headers);
  
  // Ensure we have the apikey header for all requests
  if (!headers.has('apikey') && !headers.has('Authorization')) {
    headers.set('apikey', supabaseAnonKey);
    headers.set('Authorization', `Bearer ${supabaseAnonKey}`);
  }
  
  // Add cache control to prevent stale responses
  headers.set('Cache-Control', 'no-cache');
  
  // Set a timeout to prevent hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  try {
    const response = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok && isStorageRequest) {
      console.error(`Storage API error: ${response.status} ${response.statusText}`);
      console.error(`Request URL: ${urlString}`);
    }
    
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`Fetch error for ${urlString}:`, error);
    throw error;
  }
};

// Create the Supabase client with the most reliable configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    fetch: simpleFetch,
  },
  // Ensure we're using the public schema
  db: {
    schema: 'public',
  },
});

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          organization_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          organization_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          organization_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          created_at?: string;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          role?: 'global_admin' | 'org_admin' | 'team_admin' | 'read_only';
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Record<string, any> | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Record<string, any> | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Record<string, any> | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
