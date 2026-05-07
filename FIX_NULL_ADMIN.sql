-- Quick Fix for "null Admin" Issue
-- Run this in Supabase SQL Editor NOW

-- Step 1: Remove rezaul990drive@gmail.com from admin_users table
-- This is causing the "(null Admin)" badge
DELETE FROM admin_users WHERE email = 'rezaul990drive@gmail.com';

-- Step 2: Ensure they are in superadmin_users table
INSERT INTO superadmin_users (id, email)
SELECT id, email FROM auth.users 
WHERE email = 'rezaul990drive@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify the fix
SELECT 'Super Admins:' as type, email FROM superadmin_users
UNION ALL
SELECT 'Area Admins:' as type, email || ' (' || COALESCE(area, 'NO AREA') || ')' as email FROM admin_users
ORDER BY type DESC;

-- Expected Result:
-- You should see rezaul990drive@gmail.com under "Super Admins"
-- They should NOT appear under "Area Admins"

-- After running this:
-- 1. Sign out from the web app
-- 2. Sign in again as rezaul990drive@gmail.com
-- 3. You should now see "(Super Admin)" badge
-- 4. NOT "(null Admin)"
