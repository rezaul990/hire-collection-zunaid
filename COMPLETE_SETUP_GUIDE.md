# Complete Setup Guide - Three-Tier System

## Overview

This guide will help you set up the three-tier admin system with **rezaul990drive@gmail.com** as the Super Admin.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SUPER ADMIN                          │
│              rezaul990drive@gmail.com                   │
│  • Sees ALL areas                                       │
│  • Uploads data for ALL areas                           │
│  • Manages area admins                                  │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐    ┌────────▼────────┐
│  AREA ADMIN     │    │  AREA ADMIN     │
│  (Tangail)      │    │  (Dhaka)        │
│  • Tangail only │    │  • Dhaka only   │
└────────┬────────┘    └────────┬────────┘
         │                      │
    ┌────┴────┐            ┌────┴────┐
    │ USERS   │            │ USERS   │
    │ (Plaza) │            │ (Plaza) │
    └─────────┘            └─────────┘
```

## Step-by-Step Setup

### Step 1: Disable Email Confirmation (Recommended)

**Why**: Prevents "email rate limit exceeded" errors during signup.

**How**:
1. Go to your Supabase Dashboard
2. Navigate to: **Authentication** → **Providers** → **Email**
3. Find "Confirm email" toggle
4. **Disable it** (turn it OFF)
5. Click **Save**

✅ Users can now sign up and immediately access the system without email verification.

---

### Step 2: Create Database Functions

**Why**: The admin panel needs these functions to populate area dropdowns.

**How**:
1. Go to Supabase Dashboard
2. Navigate to: **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Function to get available plazas (already exists)
CREATE OR REPLACE FUNCTION get_available_plazas()
RETURNS TABLE (plaza TEXT) AS $$
  SELECT DISTINCT plaza FROM hire_collection_data 
  WHERE plaza IS NOT NULL AND plaza != ''
  ORDER BY plaza;
$$ LANGUAGE SQL STABLE;

-- Function to get available areas (NEW - needed for admin panel)
CREATE OR REPLACE FUNCTION get_available_areas()
RETURNS TABLE (area TEXT) AS $$
  SELECT DISTINCT area FROM hire_collection_data 
  WHERE area IS NOT NULL AND area != ''
  ORDER BY area;
$$ LANGUAGE SQL STABLE;
```

5. Click **Run** (or press F5)
6. You should see: "Success. No rows returned"

✅ Database functions created successfully.

---

### Step 3: Sign Up Super Admin

**Important**: Do this BEFORE running the SQL in Step 4.

**How**:
1. Open your web app in browser
2. Click **Sign Up**
3. Enter:
   - Email: `rezaul990drive@gmail.com`
   - Password: (choose a strong password)
   - Plaza: (select any plaza or leave empty - doesn't matter)
4. Click **Sign Up**
5. You should be signed in automatically

✅ Super admin account created (but not yet activated).

---

### Step 4: Activate Super Admin

**Why**: This gives rezaul990drive@gmail.com super admin privileges.

**How**:
1. Go to Supabase Dashboard
2. Navigate to: **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

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

5. Click **Run**
6. You should see a table with one row showing rezaul990drive@gmail.com

✅ Super admin activated!

---

### Step 5: Verify Super Admin Access

**How**:
1. Go back to your web app
2. **Sign out** (if signed in)
3. **Sign in** with rezaul990drive@gmail.com
4. Check that you see:
   - ✅ "(Super Admin)" badge next to email in header
   - ✅ "Manage Admins" button in header
   - ✅ "Upload New Data" button

✅ Super admin is working correctly!

---

### Step 6: Upload Initial Data (Optional)

**Note**: You need data in the database before you can add area admins (because areas come from the data).

**How**:
1. Sign in as rezaul990drive@gmail.com
2. Click **Upload New Data**
3. Select your 3 Excel files:
   - Target / Collection Excel
   - Current Overdue Excel
   - Previous Overdue Excel
4. Click **Upload & Save to Database**
5. Confirm the replacement dialog
6. Wait for upload to complete

✅ Initial data uploaded. Areas are now available.

---

### Step 7: Add Area Admins

**How**:
1. Sign in as rezaul990drive@gmail.com (super admin)
2. Click **Manage Admins** button in header
3. Admin panel opens
4. To add an area admin:
   - Enter their email (e.g., `tangail_admin@company.com`)
   - Select their area (e.g., "Tangail")
   - Click **Add Area Admin**
5. Repeat for other areas

**Important**: The user must sign up first before you can make them an area admin.

✅ Area admins added!

---

### Step 8: Test Area Admin

**How**:
1. Have the area admin sign up (if not already)
2. They sign in with their email
3. They should see:
   - ✅ "({Area} Admin)" badge (e.g., "Tangail Admin")
   - ✅ "Upload New Data" button
   - ✅ Only their area's data
4. They can upload data (replaces only their area)

✅ Area admin is working correctly!

---

### Step 9: Test Regular User

**How**:
1. Sign up with a new email
2. Select a plaza during signup
3. Sign in
4. They should see:
   - ✅ "({Plaza})" badge (e.g., "Walton Plaza-Ghatail")
   - ❌ NO "Upload New Data" button
   - ❌ NO "Manage Admins" button
   - ✅ Only their plaza's data

✅ Regular user is working correctly!

---

## Quick Reference

### User Roles Summary

| Role | Badge | Upload | Manage Admins | Data Access |
|------|-------|--------|---------------|-------------|
| Super Admin | "(Super Admin)" | ✅ All areas | ✅ Yes | All areas |
| Area Admin | "({Area} Admin)" | ✅ Their area | ❌ No | Their area |
| Regular User | "({Plaza})" | ❌ No | ❌ No | Their plaza |

### Common Tasks

#### Add Area Admin:
1. User signs up first
2. Super admin clicks "Manage Admins"
3. Enter email and select area
4. Click "Add Area Admin"

#### Remove Area Admin:
1. Super admin clicks "Manage Admins"
2. Click "Remove" next to admin's name
3. Confirm removal

#### Upload Data:
- **Super Admin**: Replaces ALL data
- **Area Admin**: Replaces only their area's data

---

## Troubleshooting

### Issue: "Email rate limit exceeded"
**Solution**: Disable email confirmation in Supabase (Step 1)

### Issue: Shows "(null Admin)" instead of "(Super Admin)"
**Solution**: 
1. The user is in both `admin_users` and `superadmin_users` tables
2. Run this SQL in Supabase SQL Editor:
```sql
DELETE FROM admin_users WHERE email = 'rezaul990drive@gmail.com';
```
3. Or run the complete fix: `FIX_NULL_ADMIN.sql`
4. Sign out and sign in again
5. Should now show "(Super Admin)"

### Issue: Super admin doesn't see admin features
**Solution**: 
1. Make sure you ran the SQL in Step 4
2. Sign out and sign in again
3. Check browser console for errors

### Issue: Can't add area admin - "User not found"
**Solution**: The user must sign up first before you can make them an admin

### Issue: Area dropdown is empty in admin panel
**Solution**: Upload data first (Step 6) - areas come from the data

### Issue: Area admin sees no data
**Solution**: 
1. Check that their area name matches exactly (case-sensitive)
2. Make sure data exists for that area
3. Sign out and sign in again

---

## Security Notes

### Database Level Security:
- ✅ Row Level Security (RLS) policies enforce access control
- ✅ Super admin can see all data
- ✅ Area admin can only see their area
- ✅ Regular users can only see their plaza
- ✅ Cannot be bypassed even if someone modifies frontend code

### Application Level Security:
- ✅ UI shows/hides features based on role
- ✅ Upload button only visible to admins
- ✅ Admin panel only accessible to super admin

---

## Next Steps

After setup is complete:

1. **Add more area admins** as needed
2. **Train area admins** on how to upload data
3. **Invite regular users** to sign up
4. **Monitor usage** via Supabase dashboard
5. **Backup data** regularly

---

## Support

If you encounter issues:

1. Check browser console for errors (F12)
2. Check Supabase logs in dashboard
3. Review the documentation:
   - `THREE_TIER_SYSTEM.md` - System overview
   - `SETUP_SUPERADMIN.sql` - SQL commands
   - `README.md` - User guide

---

## Summary

✅ **Super Admin**: rezaul990drive@gmail.com
✅ **Three-tier system**: Super Admin → Area Admins → Regular Users
✅ **Secure**: RLS policies enforce access control
✅ **Flexible**: Easy to add/remove area admins
✅ **Scalable**: Supports multiple areas and plazas

**Your system is ready to use!** 🎉
