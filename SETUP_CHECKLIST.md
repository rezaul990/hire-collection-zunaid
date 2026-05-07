# Setup Checklist - Three-Tier System

## Pre-Setup Verification

- [ ] Supabase project created
- [ ] Database tables exist (uploads, hire_collection_data, user_profiles, admin_users, superadmin_users)
- [ ] Web app files deployed (index.html, app.js, config.js)
- [ ] config.js has correct Supabase URL and anon key
- [ ] `get_available_plazas()` function exists in database

---

## Setup Steps

### Step 1: Disable Email Confirmation ⏱️ 1 minute

- [ ] Open Supabase Dashboard
- [ ] Navigate to: **Authentication** → **Providers** → **Email**
- [ ] Find "Confirm email" toggle
- [ ] **Disable it** (turn OFF)
- [ ] Click **Save**
- [ ] ✅ Email confirmation disabled

**Why**: Prevents "email rate limit exceeded" errors

---

### Step 2: Create Database Function ⏱️ 1 minute

- [ ] Open Supabase Dashboard
- [ ] Navigate to: **SQL Editor**
- [ ] Click **New Query**
- [ ] Copy and paste this SQL:

```sql
CREATE OR REPLACE FUNCTION get_available_areas()
RETURNS TABLE (area TEXT) AS $$
  SELECT DISTINCT area FROM hire_collection_data 
  WHERE area IS NOT NULL AND area != ''
  ORDER BY area;
$$ LANGUAGE SQL STABLE;
```

- [ ] Click **Run** (or press F5)
- [ ] Verify: "Success. No rows returned"
- [ ] ✅ Function created

**Why**: Admin panel needs this to populate area dropdown

---

### Step 3: Sign Up Super Admin ⏱️ 1 minute

- [ ] Open web app in browser
- [ ] Click **Sign Up**
- [ ] Enter email: `rezaul990drive@gmail.com`
- [ ] Enter password: (choose a strong password)
- [ ] Select any plaza (or leave empty - doesn't matter)
- [ ] Click **Sign Up**
- [ ] Verify: Automatically signed in
- [ ] ✅ Super admin account created

**Note**: Account created but not yet activated as super admin

---

### Step 4: Activate Super Admin ⏱️ 1 minute

- [ ] Open Supabase Dashboard
- [ ] Navigate to: **SQL Editor**
- [ ] Click **New Query**
- [ ] Copy and paste this SQL:

```sql
-- Add rezaul990drive@gmail.com as Super Admin
INSERT INTO superadmin_users (id, email)
SELECT id, email FROM auth.users 
WHERE email = 'rezaul990drive@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Remove from admin_users if exists (cleanup)
DELETE FROM admin_users WHERE email = 'rezaul990drive@gmail.com';

-- Verify super admin was added
SELECT * FROM superadmin_users;
```

- [ ] Click **Run**
- [ ] Verify: Table shows one row with rezaul990drive@gmail.com
- [ ] ✅ Super admin activated

---

### Step 5: Verify Super Admin Access ⏱️ 1 minute

- [ ] Go to web app
- [ ] Sign out (if signed in)
- [ ] Sign in with: `rezaul990drive@gmail.com`
- [ ] Check header shows: `rezaul990drive@gmail.com (Super Admin)`
- [ ] Check "Manage Admins" button is visible
- [ ] Check "Upload New Data" button is visible
- [ ] ✅ Super admin working correctly

**If not working**: Clear browser cache and try again

---

## Post-Setup Tasks

### Upload Initial Data (Optional but Recommended) ⏱️ 5 minutes

- [ ] Sign in as rezaul990drive@gmail.com
- [ ] Click **Upload New Data**
- [ ] Select Target Excel file
- [ ] Select Current Overdue Excel file
- [ ] Select Previous Overdue Excel file
- [ ] Click **Upload & Save to Database**
- [ ] Confirm replacement dialog
- [ ] Wait for upload to complete
- [ ] Verify data appears in dashboard
- [ ] ✅ Initial data uploaded

**Why**: Areas come from data - needed before adding area admins

---

### Add First Area Admin ⏱️ 2 minutes

**Prerequisites**: 
- Area admin must sign up first
- Initial data must be uploaded (so areas exist)

Steps:
- [ ] Area admin signs up with their email
- [ ] You sign in as rezaul990drive@gmail.com
- [ ] Click **Manage Admins** button
- [ ] Enter area admin's email
- [ ] Select their area from dropdown
- [ ] Click **Add Area Admin**
- [ ] Verify success message
- [ ] Verify admin appears in list
- [ ] ✅ Area admin added

---

### Test Area Admin Access ⏱️ 2 minutes

- [ ] Area admin signs out (if signed in)
- [ ] Area admin signs in with their email
- [ ] Check header shows: `email ({Area} Admin)`
- [ ] Check "Upload New Data" button is visible
- [ ] Check NO "Manage Admins" button
- [ ] Check can only see their area's data
- [ ] Try uploading data (should work)
- [ ] ✅ Area admin working correctly

---

### Test Regular User Access ⏱️ 2 minutes

- [ ] Sign up with test email
- [ ] Select a plaza during signup
- [ ] Sign in with test email
- [ ] Check header shows: `email ({Plaza})`
- [ ] Check NO "Upload New Data" button
- [ ] Check NO "Manage Admins" button
- [ ] Check can only see their plaza's data
- [ ] Try filters and export (should work)
- [ ] ✅ Regular user working correctly

---

## Verification Checklist

### Super Admin Verification
- [ ] Badge shows "(Super Admin)"
- [ ] Can see "Manage Admins" button
- [ ] Can see "Upload New Data" button
- [ ] Can see data from all areas
- [ ] Can open admin panel
- [ ] Can add area admins
- [ ] Can remove area admins
- [ ] Can upload data (replaces ALL)

### Area Admin Verification
- [ ] Badge shows "({Area} Admin)"
- [ ] Can see "Upload New Data" button
- [ ] CANNOT see "Manage Admins" button
- [ ] Can only see their area's data
- [ ] Can upload data (replaces only their area)
- [ ] Cannot see other areas' data

### Regular User Verification
- [ ] Badge shows "({Plaza})"
- [ ] CANNOT see "Upload New Data" button
- [ ] CANNOT see "Manage Admins" button
- [ ] Can only see their plaza's data
- [ ] Cannot upload data
- [ ] Can use filters and export

---

## Troubleshooting Checklist

### Issue: Email rate limit exceeded
- [ ] Check if email confirmation is disabled
- [ ] Go to Supabase → Authentication → Providers → Email
- [ ] Disable "Confirm email"
- [ ] Try signing up again

### Issue: Shows "(null Admin)" badge
- [ ] User is in both admin_users and superadmin_users tables
- [ ] Go to Supabase → SQL Editor
- [ ] Run: `DELETE FROM admin_users WHERE email = 'rezaul990drive@gmail.com';`
- [ ] Or run the complete fix: FIX_NULL_ADMIN.sql
- [ ] Sign out and sign in again
- [ ] Should now show "(Super Admin)"

### Issue: Super admin doesn't see admin features
- [ ] Check if SQL was run correctly
- [ ] Go to Supabase → SQL Editor
- [ ] Run: `SELECT * FROM superadmin_users;`
- [ ] Verify rezaul990drive@gmail.com is listed
- [ ] Sign out and sign in again
- [ ] Clear browser cache

### Issue: Can't add area admin - "User not found"
- [ ] Verify user has signed up first
- [ ] Go to Supabase → Authentication → Users
- [ ] Check if user's email is listed
- [ ] If not, have them sign up first

### Issue: Area dropdown is empty
- [ ] Check if data has been uploaded
- [ ] Go to Supabase → Table Editor → hire_collection_data
- [ ] Verify data exists
- [ ] Check if `get_available_areas()` function exists
- [ ] Run: `SELECT * FROM get_available_areas();`

### Issue: Area admin sees no data
- [ ] Check if their area name matches exactly
- [ ] Area names are case-sensitive
- [ ] Go to Supabase → Table Editor → admin_users
- [ ] Verify their area spelling
- [ ] Sign out and sign in again

---

## Quick Reference

### Super Admin Email
```
rezaul990drive@gmail.com
```

### SQL to Check Super Admin
```sql
SELECT * FROM superadmin_users;
```

### SQL to Check Area Admins
```sql
SELECT * FROM admin_users;
```

### SQL to Check All Users
```sql
SELECT email, plaza FROM user_profiles;
```

### SQL to Check Data
```sql
SELECT DISTINCT area FROM hire_collection_data ORDER BY area;
```

---

## Completion Checklist

- [ ] ✅ Email confirmation disabled
- [ ] ✅ Database function created
- [ ] ✅ Super admin signed up
- [ ] ✅ Super admin activated
- [ ] ✅ Super admin verified
- [ ] ✅ Initial data uploaded
- [ ] ✅ First area admin added
- [ ] ✅ Area admin tested
- [ ] ✅ Regular user tested
- [ ] ✅ All roles working correctly

---

## 🎉 Setup Complete!

**Total Time**: ~15 minutes

**Next Steps**:
1. Add more area admins as needed
2. Invite regular users to sign up
3. Train users on the system
4. Monitor usage via Supabase dashboard

---

## Documentation Reference

- **Quick Setup**: QUICK_SETUP.md
- **Detailed Guide**: COMPLETE_SETUP_GUIDE.md
- **System Docs**: THREE_TIER_SYSTEM.md
- **SQL Commands**: SETUP_SUPERADMIN.sql
- **System Status**: SYSTEM_STATUS.md
- **Diagrams**: SYSTEM_DIAGRAM.md

---

**Questions? Check the documentation files above!** 📚
