-- Fix Admin User Access
-- Run this in Supabase Dashboard → SQL Editor
-- This script adds the admin user to the user_roles table

-- Replace 'rishavaeron80235@gmail.com' with your actual admin email if different
-- Then execute the following:

-- Step 1: Find the admin user in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'rishavaeron80235@gmail.com';

-- Step 2: Manually add admin role for the existing user
-- Replace 'USER_ID_FROM_STEP_1' with the actual user ID from Step 1
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'rishavaeron80235@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify the user has admin role
SELECT ur.*, au.email 
FROM public.user_roles ur 
JOIN auth.users au ON ur.user_id = au.id 
WHERE au.email = 'rishavaeron80235@gmail.com';

-- Step 4: Also update the trigger to handle OAuth better (fix for Google sign-in)
-- This ensures the trigger works even when email is not directly available
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Try to get email from the new user record
  user_email := NEW.email;
  
  -- If email is not set, try to get it from user_metadata
  IF user_email IS NULL OR user_email = '' THEN
    user_email := NEW.raw_user_meta_data->>'email';
  END IF;
  
  -- Assign admin role if email matches
  IF user_email = 'rishavaeron80235@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 5: Grant proper permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
