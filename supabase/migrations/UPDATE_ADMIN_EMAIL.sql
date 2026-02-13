-- Helper: Update admin email in the auto-assign trigger
-- Replace 'your-admin@example.com' with your actual admin email
-- Run this in Supabase Dashboard → SQL Editor

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'your-admin@example.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

-- Note: This only affects NEW signups. For existing users, manually add them:
-- INSERT INTO public.user_roles (user_id, role) 
-- SELECT id, 'admin' FROM auth.users WHERE email = 'your-admin@example.com'
-- ON CONFLICT (user_id, role) DO NOTHING;
