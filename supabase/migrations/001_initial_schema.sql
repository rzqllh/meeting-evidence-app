/*
 * =====================================================================================
 *
 *       Filename:  001_initial_schema.sql
 *
 *    Description:  Initial database schema for the Meeting Evidence App.
 *                  This script sets up tables, relationships, and Row Level Security.
 *
 *        Version:  1.0
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */

-- ----------------------------------------------------------------
-- 1. ENUMS (CUSTOM TYPES)
-- Using ENUMs ensures data integrity. We can only use the values defined here.
-- ----------------------------------------------------------------

-- Custom type for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'member');

-- Custom type for evidence categories
CREATE TYPE public.evidence_category AS ENUM (
  'meeting_activity',
  'snack_morning',
  'coffee_noon',
  'snack_afternoon',
  'lunch',
  'attendance'
);


-- ----------------------------------------------------------------
-- 2. USERS TABLE
-- This table stores public user data. It is linked 1-to-1 with the
-- auth.users table, which handles the private authentication information.
-- ----------------------------------------------------------------

CREATE TABLE public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role public.user_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments to explain the columns
COMMENT ON TABLE public.users IS 'Public user profile information, linked to authentication user.';
COMMENT ON COLUMN public.users.id IS 'Links to auth.users.id. Primary key.';
COMMENT ON COLUMN public.users.role IS 'Application-specific role for the user.';


-- ----------------------------------------------------------------
-- 3. AUTOMATIC USER PROFILE CREATION
-- This function and trigger will automatically create a new public.users
-- entry whenever a new user signs up in Supabase Auth.
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ----------------------------------------------------------------
-- 4. EVENTS TABLE
-- Stores information about each meeting or event.
-- ----------------------------------------------------------------

CREATE TABLE public.events (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.events IS 'Stores meeting events.';
COMMENT ON COLUMN public.events.created_by IS 'The user who created the event. If user is deleted, this becomes NULL.';


-- ----------------------------------------------------------------
-- 5. EVIDENCE PHOTOS TABLE
-- This is the core table, linking photos to events and users.
-- ----------------------------------------------------------------

CREATE TABLE public.evidence_photos (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category public.evidence_category NOT NULL,
  note TEXT,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.evidence_photos IS 'Stores metadata for each uploaded evidence photo.';
COMMENT ON COLUMN public.evidence_photos.event_id IS 'The event this photo belongs to. If event is deleted, photo is also deleted.';
COMMENT ON COLUMN public.evidence_photos.user_id IS 'The user who uploaded the photo. If user is deleted, photo is also deleted.';
COMMENT ON COLUMN public.evidence_photos.photo_url IS 'The path to the photo in Supabase Storage.';


-- ----------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS)
-- This is the most critical security step. It ensures that users can
-- only access data they are permitted to.
-- ----------------------------------------------------------------

-- Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_photos ENABLE ROW LEVEL SECURITY;

-- Create a helper function to check a user's role.
-- This is more secure and reusable than checking the table directly in policies.
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role AS $$
DECLARE
  user_role public.user_role;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = user_id;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- POLICIES FOR `users` TABLE
CREATE POLICY "Users can view their own profile."
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view and manage all user profiles."
  ON public.users FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');


-- POLICIES FOR `events` TABLE
CREATE POLICY "All authenticated users can view events."
  ON public.events FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can create, update, and delete events."
  ON public.events FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');


-- POLICIES FOR `evidence_photos` TABLE
CREATE POLICY "Users can view all photos." -- For simplicity, anyone can see any photo. We can restrict this later if needed.
  ON public.evidence_photos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can upload photos for themselves."
  ON public.evidence_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own photos."
  ON public.evidence_photos FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can do anything with photos."
  ON public.evidence_photos FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Note: We will also need to set up Storage policies for file access.
-- This will be done in the file upload sprint. This database schema is the foundation.