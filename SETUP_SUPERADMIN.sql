-- Setup Super Admin
-- Run this in Supabase SQL Editor

-- Step 1: Create get_available_areas function (if not exists)
CREATE OR REPLACE FUNCTION get_available_areas()
RETURNS TABLE (area TEXT) AS $$
  SELECT DISTINCT area FROM hire_collection_data 
  WHERE area IS NOT NULL AND area != ''
  ORDER BY area;
$$ LANGUAGE SQL STABLE;

-- Step 2: IMPORTANT - Remove rezaul990drive@gmail.com from admin_users first
-- This ensures they won't show as "(null Admin)"
DELETE FROM admin_users WHERE email = 'rezaul990drive@gmail.com';

-- Step 3: Add rezaul990drive@gmail.com as Super Admin
-- Note: User must sign up first before running this
INSERT INTO superadmin_users (id, email)
SELECT id, email FROM auth.users 
WHERE email = 'rezaul990drive@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Step 4: Verify super admin was added
SELECT 'Super Admin:' as type, email FROM superadmin_users
UNION ALL
SELECT 'Area Admins:' as type, email || ' (' || area || ')' as email FROM admin_users
ORDER BY type DESC;

-- Done! Now:
-- 1. Sign out and sign in as rezaul990drive@gmail.com
-- 2. You should see "(Super Admin)" badge
-- 3. You should see "Manage Admins" button
-- 4. You can add area admins (like Tangail Admin, Dhaka Admin, etc.) via the admin panel
-- 5. You can upload data for ALL areas
