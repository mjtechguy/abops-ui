// Supabase data service for accessing database data
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Types for data
export type Organization = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'editor' | 'read_only';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
};

// Error type for Supabase service
export type SupabaseError = {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
};

// Supabase data service
export const dataService = {
  // Check Supabase connection
  async checkConnection() {
    try {
      // First check if we have an authenticated session
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      // Check for mock user if no session
      if (!session) {
        const mockUserJson = typeof window !== 'undefined' ? localStorage.getItem('mockUser') : null;
        if (mockUserJson) {
          // We have a mock user, so we're connected
          return { connected: true, error: null };
        } else {
          return {
            connected: false,
            error: {
              message: 'No authenticated session found',
              details: 'Please log in to access the database',
            } as SupabaseError
          };
        }
      }

      // Then try to access the database
      const { data, error } = await supabase.from('organizations').select('count').single();
      if (error) throw error;
      
      return { connected: true, error: null };
    } catch (error) {
      console.error('Supabase connection error:', error);
      return { 
        connected: false, 
        error: {
          message: 'Failed to connect to database',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },

  // Organizations
  async getOrganizations() {
    try {
      // Check for mock user first
      const mockUserJson = typeof window !== 'undefined' ? localStorage.getItem('mockUser') : null;
      if (mockUserJson) {
        // Use mock data for organizations
        const mockOrganizations = [
          {
            id: '78a5c713-3405-46ab-98d4-379ee5ec15d0',
            name: 'Default Organization',
            description: 'This is the default organization',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        return { data: mockOrganizations, error: null };
      }

      // Otherwise use Supabase
      const { data, error } = await supabase.from('organizations').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return { 
        data: [], 
        error: {
          message: 'Failed to fetch organizations',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },
  
  async getOrganizationById(id: string) {
    try {
      const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching organization by ID:', error);
      return { 
        data: null, 
        error: {
          message: 'Failed to fetch organization',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },
  
  // Teams
  async getTeams() {
    try {
      // Check for mock user first
      const mockUserJson = typeof window !== 'undefined' ? localStorage.getItem('mockUser') : null;
      if (mockUserJson) {
        // Use mock data for teams
        const mockTeams = [
          {
            id: '216edb44-9396-4b51-b533-5efe811382cc',
            name: 'Default Team',
            description: 'This is the default team',
            organization_id: '78a5c713-3405-46ab-98d4-379ee5ec15d0',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        return { data: mockTeams, error: null };
      }

      // Otherwise use Supabase
      const { data, error } = await supabase.from('teams').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching teams:', error);
      return { 
        data: [], 
        error: {
          message: 'Failed to fetch teams',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },
  
  async getTeamById(id: string) {
    try {
      const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching team by ID:', error);
      return { 
        data: null, 
        error: {
          message: 'Failed to fetch team',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },
  
  async getTeamsByOrganizationId(organizationId: string) {
    try {
      const { data, error } = await supabase.from('teams').select('*').eq('organization_id', organizationId);
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching teams by organization ID:', error);
      return { 
        data: [], 
        error: {
          message: 'Failed to fetch teams for organization',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },
  
  // User Profiles
  async getUserProfiles() {
    try {
      // Check for mock user first
      const mockUserJson = typeof window !== 'undefined' ? localStorage.getItem('mockUser') : null;
      if (mockUserJson) {
        // Use mock data for user profiles
        const mockUser = JSON.parse(mockUserJson) as User;
        const mockProfiles = [
          {
            id: mockUser.id || 'a69c1590-9cd6-4790-8951-a6a896097f7c',
            full_name: mockUser.user_metadata?.full_name || 'Admin User',
            avatar_url: null,
            role: 'admin',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        return { data: mockProfiles, error: null };
      }

      // Otherwise use Supabase
      const { data, error } = await supabase.from('user_profiles').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      return { 
        data: [], 
        error: {
          message: 'Failed to fetch user profiles',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },
  
  async getUserProfileById(id: string) {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*').eq('id', id).single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user profile by ID:', error);
      return { 
        data: null, 
        error: {
          message: 'Failed to fetch user profile',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },
  
  // Audit Logs
  async getAuditLogs() {
    try {
      // Check for mock user first
      const mockUserJson = typeof window !== 'undefined' ? localStorage.getItem('mockUser') : null;
      if (mockUserJson) {
        // Use mock data for audit logs
        const mockUser = JSON.parse(mockUserJson) as User;
        const mockLogs = [
          {
            id: '1',
            user_id: mockUser.id || 'a69c1590-9cd6-4790-8951-a6a896097f7c',
            action: 'login',
            entity_type: 'auth',
            entity_id: null,
            details: { method: 'password' },
            ip_address: '127.0.0.1',
            created_at: new Date().toISOString()
          }
        ];
        return { data: mockLogs, error: null };
      }

      // Otherwise use Supabase
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return { 
        data: [], 
        error: {
          message: 'Failed to fetch audit logs',
          details: error instanceof Error ? error.message : 'Unknown error',
        } as SupabaseError 
      };
    }
  },
};
