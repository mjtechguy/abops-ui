-- Fix RLS policies to eliminate infinite recursion
-- Drop problematic policies first

-- Drop policies for user_profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update user profiles" ON public.user_profiles;

-- Drop policies for organization_members
DROP POLICY IF EXISTS "Organization admins can view members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can view all organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins and org admins can insert organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins and org admins can update organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can delete organization members" ON public.organization_members;

-- Drop policies for team_members
DROP POLICY IF EXISTS "Team admins can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can view all team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins and team admins can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins and team admins can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can delete team members" ON public.team_members;

-- Create a function to safely check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to safely check if a user is an org admin
CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_id = org_id AND user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to safely check if a user is a team admin
CREATE OR REPLACE FUNCTION public.is_team_admin(tm_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_id = tm_id AND user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies for user_profiles using the function
CREATE POLICY "Admins can view all profiles" 
    ON public.user_profiles 
    FOR SELECT 
    USING (
        public.is_admin() OR auth.uid() = id
    );

CREATE POLICY "Admins can update user profiles" 
    ON public.user_profiles 
    FOR UPDATE 
    USING (
        public.is_admin() OR auth.uid() = id
    );

-- Recreate policies for organization_members using the functions
CREATE POLICY "Members can view their own org membership" 
    ON public.organization_members 
    FOR SELECT 
    USING (
        user_id = auth.uid()
    );

CREATE POLICY "Org admins can view members" 
    ON public.organization_members 
    FOR SELECT 
    USING (
        public.is_org_admin(organization_id)
    );

CREATE POLICY "Admins can view all organization members" 
    ON public.organization_members 
    FOR SELECT 
    USING (
        public.is_admin()
    );

CREATE POLICY "Admins and org admins can insert organization members" 
    ON public.organization_members 
    FOR INSERT 
    WITH CHECK (
        public.is_admin() OR public.is_org_admin(organization_id)
    );

CREATE POLICY "Admins and org admins can update organization members" 
    ON public.organization_members 
    FOR UPDATE 
    USING (
        public.is_admin() OR public.is_org_admin(organization_id)
    );

CREATE POLICY "Admins can delete organization members" 
    ON public.organization_members 
    FOR DELETE 
    USING (
        public.is_admin()
    );

-- Recreate policies for team_members using the functions
CREATE POLICY "Members can view their own team membership" 
    ON public.team_members 
    FOR SELECT 
    USING (
        user_id = auth.uid()
    );

CREATE POLICY "Team admins can view team members" 
    ON public.team_members 
    FOR SELECT 
    USING (
        public.is_team_admin(team_id)
    );

CREATE POLICY "Admins can view all team members" 
    ON public.team_members 
    FOR SELECT 
    USING (
        public.is_admin()
    );

CREATE POLICY "Admins and team admins can insert team members" 
    ON public.team_members 
    FOR INSERT 
    WITH CHECK (
        public.is_admin() OR public.is_team_admin(team_id)
    );

CREATE POLICY "Admins and team admins can update team members" 
    ON public.team_members 
    FOR UPDATE 
    USING (
        public.is_admin() OR public.is_team_admin(team_id)
    );

CREATE POLICY "Admins can delete team members" 
    ON public.team_members 
    FOR DELETE 
    USING (
        public.is_admin()
    );

-- Ensure the admin user has the correct role
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
);
