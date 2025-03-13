-- Create provider_credentials table
CREATE TABLE IF NOT EXISTS public.provider_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES public.organizations(id)
);

-- Create rancher_servers table
CREATE TABLE IF NOT EXISTS public.rancher_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES public.organizations(id)
);

-- Create rancher_credentials table
CREATE TABLE IF NOT EXISTS public.rancher_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES public.rancher_servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT,
  token TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES public.organizations(id)
);

-- Add RLS policies for provider_credentials
ALTER TABLE public.provider_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Provider credentials are viewable by organization members" ON public.provider_credentials
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members WHERE organization_id = provider_credentials.organization_id
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Provider credentials are insertable by organization members with editor or admin role" ON public.provider_credentials
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = provider_credentials.organization_id
      AND (up.role = 'editor' OR up.role = 'admin')
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Provider credentials are updatable by organization members with editor or admin role" ON public.provider_credentials
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = provider_credentials.organization_id
      AND (up.role = 'editor' OR up.role = 'admin')
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Provider credentials are deletable by organization members with admin role" ON public.provider_credentials
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = provider_credentials.organization_id
      AND up.role = 'admin'
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add RLS policies for rancher_servers
ALTER TABLE public.rancher_servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rancher servers are viewable by organization members" ON public.rancher_servers
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members WHERE organization_id = rancher_servers.organization_id
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Rancher servers are insertable by organization members with editor or admin role" ON public.rancher_servers
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = rancher_servers.organization_id
      AND (up.role = 'editor' OR up.role = 'admin')
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Rancher servers are updatable by organization members with editor or admin role" ON public.rancher_servers
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = rancher_servers.organization_id
      AND (up.role = 'editor' OR up.role = 'admin')
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Rancher servers are deletable by organization members with admin role" ON public.rancher_servers
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = rancher_servers.organization_id
      AND up.role = 'admin'
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add RLS policies for rancher_credentials
ALTER TABLE public.rancher_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rancher credentials are viewable by organization members" ON public.rancher_credentials
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members WHERE organization_id = rancher_credentials.organization_id
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Rancher credentials are insertable by organization members with editor or admin role" ON public.rancher_credentials
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = rancher_credentials.organization_id
      AND (up.role = 'editor' OR up.role = 'admin')
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Rancher credentials are updatable by organization members with editor or admin role" ON public.rancher_credentials
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = rancher_credentials.organization_id
      AND (up.role = 'editor' OR up.role = 'admin')
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Rancher credentials are deletable by organization members with admin role" ON public.rancher_credentials
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om
      JOIN public.user_profiles up ON om.user_id = up.id
      WHERE om.organization_id = rancher_credentials.organization_id
      AND up.role = 'admin'
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert some sample data for testing
INSERT INTO public.provider_credentials (name, description, provider, data, created_by, organization_id)
SELECT 
  'AWS Production', 
  'Main AWS account for production workloads', 
  'aws', 
  '{"accessKey": "AKIA123456789EXAMPLE", "secretKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"}'::jsonb,
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1),
  (SELECT id FROM public.organizations LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.provider_credentials WHERE name = 'AWS Production');

INSERT INTO public.provider_credentials (name, description, provider, data, created_by, organization_id)
SELECT 
  'Azure Main', 
  'Primary Azure subscription', 
  'azure', 
  '{"clientId": "11111111-1111-1111-1111-111111111111", "clientSecret": "abcdefghijklmnopqrstuvwxyz123456789", "subscriptionId": "22222222-2222-2222-2222-222222222222", "tenantId": "33333333-3333-3333-3333-333333333333"}'::jsonb,
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1),
  (SELECT id FROM public.organizations LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.provider_credentials WHERE name = 'Azure Main');

INSERT INTO public.rancher_servers (name, address, description, created_by, organization_id)
SELECT 
  'Production Rancher', 
  'https://rancher.prod.example.com', 
  'Production Rancher management server',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1),
  (SELECT id FROM public.organizations LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.rancher_servers WHERE name = 'Production Rancher');

INSERT INTO public.rancher_credentials (server_id, name, username, password, is_default, created_by, organization_id)
SELECT 
  (SELECT id FROM public.rancher_servers WHERE name = 'Production Rancher' LIMIT 1),
  'Admin Credentials',
  'admin',
  'password123',
  true,
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1),
  (SELECT id FROM public.organizations LIMIT 1)
WHERE EXISTS (SELECT 1 FROM public.rancher_servers WHERE name = 'Production Rancher')
AND NOT EXISTS (SELECT 1 FROM public.rancher_credentials WHERE name = 'Admin Credentials');
