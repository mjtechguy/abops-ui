-- Initial Migration for ABOps UI
-- This migration creates all necessary database objects and sets up the initial admin user

-- Create enum type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'read_only');
    END IF;
END$$;

-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role public.user_role NOT NULL DEFAULT 'read_only',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'read_only',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'read_only',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT
);

-- Create site_settings table to store application settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security on all tables (even for owners)
ALTER TABLE public.organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.teams FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members FORCE ROW LEVEL SECURITY;
ALTER TABLE public.team_members FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings FORCE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
    ON public.user_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
    ON public.user_profiles 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.uid() = id
    );

CREATE POLICY "Admins can update user profiles" 
    ON public.user_profiles 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR auth.uid() = id
    );

-- Create RLS policies for organizations
CREATE POLICY "Members can view their organizations" 
    ON public.organizations 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = organizations.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all organizations" 
    ON public.organizations 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert organizations" 
    ON public.organizations 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update organizations" 
    ON public.organizations 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = organizations.id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete organizations" 
    ON public.organizations 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for teams
CREATE POLICY "Organization members can view teams" 
    ON public.teams 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = teams.organization_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all teams" 
    ON public.teams 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins and org admins can insert teams" 
    ON public.teams 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = teams.organization_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins and org admins can update teams" 
    ON public.teams 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = teams.organization_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete teams" 
    ON public.teams 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for organization_members
CREATE POLICY "Organization admins can view members" 
    ON public.organization_members 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = organization_members.organization_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can view all organization members" 
    ON public.organization_members 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins and org admins can insert organization members" 
    ON public.organization_members 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = organization_members.organization_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins and org admins can update organization members" 
    ON public.organization_members 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = organization_members.organization_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete organization members" 
    ON public.organization_members 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for team_members
CREATE POLICY "Team admins can view team members" 
    ON public.team_members 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.team_members 
            WHERE team_id = team_members.team_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can view all team members" 
    ON public.team_members 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins and team admins can insert team members" 
    ON public.team_members 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR EXISTS (
            SELECT 1 FROM public.team_members 
            WHERE team_id = team_members.team_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins and team admins can update team members" 
    ON public.team_members 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR EXISTS (
            SELECT 1 FROM public.team_members 
            WHERE team_id = team_members.team_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete team members" 
    ON public.team_members 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs" 
    ON public.audit_logs 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (for public data)
GRANT SELECT ON public.organizations TO anon;
GRANT SELECT ON public.teams TO anon;

-- Create admin user and initial data
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Check if admin user exists with the email from .env.local
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@example.com';
    
    -- If we don't find the user, it might be because the email was changed via the environment variable
    -- So let's check for the actual email that should be used
    IF admin_user_id IS NULL THEN
        -- Try to find the admin user with any email (in case the email was changed)
        SELECT id INTO admin_user_id FROM auth.users 
        WHERE raw_app_meta_data->>'role' = 'admin' LIMIT 1;
    END IF;
    
    IF admin_user_id IS NULL THEN
        -- Create admin user with credentials from environment variables
        -- The reset-supabase.sh script replaces these values with the ones from .env.local
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@example.com',
            crypt('Password123!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"], "role": "admin"}',
            '{"full_name": "Global Admin User"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO admin_user_id;
        
        RAISE NOTICE 'Created admin user with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
    END IF;
    
    -- Create or update user profile as a global admin
    INSERT INTO public.user_profiles (id, full_name, role, is_active, created_at, updated_at)
    VALUES (
        admin_user_id,
        'Global Admin User',
        'admin',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) 
    DO UPDATE SET
        full_name = 'Global Admin User',
        role = 'admin',
        is_active = TRUE,
        updated_at = NOW();
    
    RAISE NOTICE 'User profile created or updated';
    
    -- Create default organization if not exists
    DECLARE
        org_id UUID;
    BEGIN
        -- Check if default organization exists
        SELECT id INTO org_id FROM public.organizations WHERE name = 'Default Organization';
        
        IF org_id IS NULL THEN
            -- Create default organization
            INSERT INTO public.organizations (name, description, created_at, updated_at)
            VALUES ('Default Organization', 'This is the default organization', NOW(), NOW())
            RETURNING id INTO org_id;
            
            RAISE NOTICE 'Created default organization with ID: %', org_id;
        ELSE
            RAISE NOTICE 'Default organization already exists with ID: %', org_id;
        END IF;
        
        -- Add user as organization admin if not already a member
        IF NOT EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE organization_id = org_id AND user_id = admin_user_id
        ) THEN
            INSERT INTO public.organization_members (organization_id, user_id, role, created_at, updated_at)
            VALUES (org_id, admin_user_id, 'admin', NOW(), NOW());
            
            RAISE NOTICE 'Added user as organization admin';
        ELSE
            -- Ensure the user is an admin of the organization
            UPDATE public.organization_members
            SET role = 'admin', updated_at = NOW()
            WHERE organization_id = org_id AND user_id = admin_user_id AND role != 'admin';
            
            RAISE NOTICE 'User is already an organization member, ensured admin role';
        END IF;
        
        -- Create default team if not exists
        DECLARE
            default_team_id UUID;
        BEGIN
            -- Check if default team exists
            SELECT id INTO default_team_id FROM public.teams 
            WHERE name = 'Default Team' AND organization_id = org_id;
            
            IF default_team_id IS NULL THEN
                -- Create default team
                INSERT INTO public.teams (name, description, organization_id, created_at, updated_at)
                VALUES ('Default Team', 'This is the default team', org_id, NOW(), NOW())
                RETURNING id INTO default_team_id;
                
                RAISE NOTICE 'Created default team with ID: %', default_team_id;
            ELSE
                RAISE NOTICE 'Default team already exists with ID: %', default_team_id;
            END IF;
            
            -- Add user as team admin if not already a member
            IF NOT EXISTS (
                SELECT 1 FROM public.team_members 
                WHERE team_id = default_team_id AND user_id = admin_user_id
            ) THEN
                INSERT INTO public.team_members (team_id, user_id, role, created_at, updated_at)
                VALUES (default_team_id, admin_user_id, 'admin', NOW(), NOW());
                
                RAISE NOTICE 'Added user as team admin';
            ELSE
                -- Ensure the user is an admin of the team
                UPDATE public.team_members
                SET role = 'admin', updated_at = NOW()
                WHERE team_id = default_team_id AND user_id = admin_user_id AND role != 'admin';
                
                RAISE NOTICE 'User is already a team member, ensured admin role';
            END IF;
        END;
    END;
    
    -- Add admin user to all existing organizations and teams
    DECLARE
        org_record RECORD;
        team_record RECORD;
        user_record RECORD;
        default_org_id UUID;
        default_team_id UUID;
    BEGIN
        -- Get default organization ID
        SELECT id INTO default_org_id FROM public.organizations WHERE name = 'Default Organization' LIMIT 1;
        
        -- Get default team ID
        SELECT id INTO default_team_id FROM public.teams 
        WHERE name = 'Default Team' AND organization_id = default_org_id LIMIT 1;
        
        -- Add admin to all organizations
        FOR org_record IN SELECT id FROM public.organizations WHERE id != default_org_id LOOP
            -- Add as admin to organization if not already a member
            IF NOT EXISTS (
                SELECT 1 FROM public.organization_members 
                WHERE organization_id = org_record.id AND user_id = admin_user_id
            ) THEN
                INSERT INTO public.organization_members (organization_id, user_id, role, created_at, updated_at)
                VALUES (org_record.id, admin_user_id, 'admin', NOW(), NOW());
                
                RAISE NOTICE 'Added admin to organization: %', org_record.id;
            ELSE
                -- Ensure the user is an admin of the organization
                UPDATE public.organization_members
                SET role = 'admin', updated_at = NOW()
                WHERE organization_id = org_record.id AND user_id = admin_user_id AND role != 'admin';
                
                RAISE NOTICE 'Admin already in organization: %, ensured admin role', org_record.id;
            END IF;
        END LOOP;
        
        -- Add admin to all teams
        FOR team_record IN SELECT id FROM public.teams WHERE default_team_id IS NOT NULL AND id != default_team_id LOOP
            -- Add as admin to team if not already a member
            IF NOT EXISTS (
                SELECT 1 FROM public.team_members 
                WHERE team_id = team_record.id AND user_id = admin_user_id
            ) THEN
                INSERT INTO public.team_members (team_id, user_id, role, created_at, updated_at)
                VALUES (team_record.id, admin_user_id, 'admin', NOW(), NOW());
                
                RAISE NOTICE 'Added admin to team: %', team_record.id;
            ELSE
                -- Ensure the user is an admin of the team
                UPDATE public.team_members
                SET role = 'admin', updated_at = NOW()
                WHERE team_id = team_record.id AND user_id = admin_user_id AND role != 'admin';
                
                RAISE NOTICE 'Admin already in team: %, ensured admin role', team_record.id;
            END IF;
        END LOOP;
        
        -- Add all existing users to default organization and team
        FOR user_record IN SELECT id FROM auth.users WHERE id != admin_user_id LOOP
            -- Add user to default organization if not already a member
            IF NOT EXISTS (
                SELECT 1 FROM public.organization_members 
                WHERE organization_id = default_org_id AND user_id = user_record.id
            ) THEN
                INSERT INTO public.organization_members (organization_id, user_id, role, created_at, updated_at)
                VALUES (default_org_id, user_record.id, 'read_only', NOW(), NOW());
                
                RAISE NOTICE 'Added user % to default organization', user_record.id;
            END IF;
            
            -- Add user to default team if not already a member
            IF default_team_id IS NOT NULL AND NOT EXISTS (
                SELECT 1 FROM public.team_members 
                WHERE team_id = default_team_id AND user_id = user_record.id
            ) THEN
                INSERT INTO public.team_members (team_id, user_id, role, created_at, updated_at)
                VALUES (default_team_id, user_record.id, 'read_only', NOW(), NOW());
                
                RAISE NOTICE 'Added user % to default team', user_record.id;
            END IF;
        END LOOP;
    END;
END$$;

-- Create a function to add new users to default organization and team
CREATE OR REPLACE FUNCTION auth.add_user_to_defaults()
RETURNS TRIGGER AS $$
DECLARE
    default_org_id UUID;
    default_team_id UUID;
BEGIN
    -- Create user profile if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = NEW.id) THEN
        INSERT INTO public.user_profiles (id, full_name, role, is_active, created_at, updated_at)
        VALUES (
            NEW.id, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
            'read_only',
            TRUE, 
            NOW(), 
            NOW()
        );
    END IF;
    
    -- Get default organization ID
    SELECT id INTO default_org_id FROM public.organizations WHERE name = 'Default Organization' LIMIT 1;
    
    -- If default organization exists, add user to it
    IF default_org_id IS NOT NULL THEN
        -- Add user to default organization
        INSERT INTO public.organization_members (organization_id, user_id, role, created_at, updated_at)
        VALUES (default_org_id, NEW.id, 'read_only', NOW(), NOW())
        ON CONFLICT (organization_id, user_id) DO NOTHING;
        
        -- Get default team ID
        SELECT id INTO default_team_id FROM public.teams 
        WHERE name = 'Default Team' AND organization_id = default_org_id LIMIT 1;
        
        -- If default team exists, add user to it
        IF default_team_id IS NOT NULL THEN
            -- Add user to default team
            INSERT INTO public.team_members (team_id, user_id, role, created_at, updated_at)
            VALUES (default_team_id, NEW.id, 'read_only', NOW(), NOW())
            ON CONFLICT (team_id, user_id) DO NOTHING;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to add new users to default organization and team
DO $$
BEGIN
    -- Only try to drop the trigger if it exists
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'add_user_to_defaults_trigger') THEN
        DROP TRIGGER IF EXISTS add_user_to_defaults_trigger ON auth.users;
    END IF;
    
    -- Create the trigger
    CREATE TRIGGER add_user_to_defaults_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.add_user_to_defaults();
END$$;

-- Create a trigger function to log audit events
CREATE OR REPLACE FUNCTION public.audit_log_trigger()
RETURNS TRIGGER AS $$
DECLARE
    entity_type TEXT;
    action_type TEXT;
    entity_id UUID;
    details JSONB;
BEGIN
    -- Set entity_type based on the table being modified
    entity_type := TG_TABLE_NAME;
    
    -- Set action_type based on the operation
    IF TG_OP = 'INSERT' THEN
        action_type := 'create';
        entity_id := NEW.id;
        details := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        action_type := 'update';
        entity_id := NEW.id;
        details := jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        );
    ELSIF TG_OP = 'DELETE' THEN
        action_type := 'delete';
        entity_id := OLD.id;
        details := to_jsonb(OLD);
    END IF;
    
    -- Insert audit log
    INSERT INTO public.audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        created_at,
        ip_address
    ) VALUES (
        auth.uid(),
        action_type,
        entity_type,
        entity_id,
        details,
        NOW(),
        NULL
    );
    
    -- Return the appropriate record based on the operation
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log triggers for each table
CREATE TRIGGER organizations_audit_log
AFTER INSERT OR UPDATE OR DELETE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER teams_audit_log
AFTER INSERT OR UPDATE OR DELETE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER user_profiles_audit_log
AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER organization_members_audit_log
AFTER INSERT OR UPDATE OR DELETE ON public.organization_members
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER team_members_audit_log
AFTER INSERT OR UPDATE OR DELETE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- Enable RLS on audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs" 
    ON public.audit_logs 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view their own audit logs" 
    ON public.audit_logs 
    FOR SELECT 
    USING (
        user_id = auth.uid()
    );

-- Add RLS policies for site_settings table
CREATE POLICY "Admins can read all site settings" 
  ON public.site_settings FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      JOIN public.user_profiles ON auth.users.id = public.user_profiles.id
      WHERE auth.users.id = auth.uid() AND public.user_profiles.role = 'admin'
    )
  );

-- Policy to allow all authenticated users to read non-sensitive site settings
CREATE POLICY "All users can read public site settings" 
  ON public.site_settings FOR SELECT 
  USING (key NOT LIKE 'private_%');

-- Policy to allow only admins to modify site settings
CREATE POLICY "Only admins can modify site settings" 
  ON public.site_settings FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      JOIN public.user_profiles ON auth.users.id = public.user_profiles.id
      WHERE auth.users.id = auth.uid() AND public.user_profiles.role = 'admin'
    )
  );

-- Create storage bucket for branding assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the assets bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assets' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'assets' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'assets' 
    AND auth.role() = 'authenticated'
  );
