-- Update profiles table to set default users with specific emails and roles
-- First, let's ensure the profiles table has the right structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create the trigger function to handle specific user roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.email = 'gabriel@gmail.com' THEN 'admin'
      WHEN NEW.email = 'love@world.com' THEN 'viewer'
      ELSE 'viewer'
    END
  );
  RETURN NEW;
END;
$$;

-- Drop the existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing posts table RLS policies to work better with our app
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
CREATE POLICY "Admins can update posts" 
ON public.posts 
FOR UPDATE 
USING (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::text))));

-- Create a quotes table for romantic/motivational quotes
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_text TEXT NOT NULL,
  author TEXT,
  category TEXT DEFAULT 'romantic',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on quotes table
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quotes
CREATE POLICY "Anyone can view quotes" 
ON public.quotes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert quotes" 
ON public.quotes 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::text))));

CREATE POLICY "Admins can update quotes" 
ON public.quotes 
FOR UPDATE 
USING (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::text))));

CREATE POLICY "Admins can delete quotes" 
ON public.quotes 
FOR DELETE 
USING (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::text))));

-- Create playlists table for shared playlists
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  songs JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on playlists table
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for playlists
CREATE POLICY "Anyone can view public playlists" 
ON public.playlists 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own playlists" 
ON public.playlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert playlists" 
ON public.playlists 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::text))));

CREATE POLICY "Admins can update playlists" 
ON public.playlists 
FOR UPDATE 
USING (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::text))));

CREATE POLICY "Admins can delete playlists" 
ON public.playlists 
FOR DELETE 
USING (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::text))));

-- Create triggers for updated_at columns
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at  
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();