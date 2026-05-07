# Three-Tier User System

## Overview

The system now has three levels of users with different permissions:

1. **Super Admin** - Full access to everything
2. **Area Admins** - Can upload and manage data for their specific Area
3. **Regular Users** - Can view data for their specific Plaza

## User Roles

### 1. Super Admin

**Who**: System administrator (you will set this)

**Can Do**:
✅ See ALL data from ALL areas
✅ Upload data for ALL areas
✅ Add/remove Area Admins
✅ Manage all admin users
✅ Delete all data
✅ Access admin panel

**Cannot Do**:
❌ Nothing - has full access

**Badge**: "Super Admin"

---

### 2. Area Admin

**Who**: Area-specific admins that you add via the admin panel

**Can Do**:
✅ See data for THEIR area only
✅ Upload data for THEIR area
✅ Replace data for THEIR area
✅ Delete data for THEIR area
✅ Export data for THEIR area

**Cannot Do**:
❌ See other areas' data
❌ Upload data for other areas
❌ Add/remove admins
❌ Access admin panel

**Badge**: "{Area Name} Admin" (e.g., "Tangail Admin")

---

### 3. Regular User

**Who**: All other users (Plaza-level staff)

**Can Do**:
✅ See data for THEIR plaza only
✅ Filter and search within their plaza
✅ Export data for their plaza
✅ Use all dashboard features

**Cannot Do**:
❌ Upload data
❌ See other plazas' data
❌ Add admins
❌ Delete data

**Badge**: "{Plaza Name}" (e.g., "Walton Plaza-Ghatail")

## Data Access Matrix

| Role | Can See | Can Upload | Can Delete | Can Manage Admins |
|------|---------|------------|------------|-------------------|
| Super Admin | All Areas | All Areas | All Data | Yes |
| Area Admin | Their Area | Their Area | Their Area Data | No |
| Regular User | Their Plaza | No | No | No |

## Setup Instructions

### Step 1: Create Super Admin

You need to manually add the super admin:

1. **First, sign up** with rezaul990drive@gmail.com in the web app
2. **Then run this SQL** in Supabase SQL Editor:

```sql
-- Run SETUP_SUPERADMIN.sql in Supabase SQL Editor
-- This will make rezaul990drive@gmail.com the super admin
```

Or manually:

```sql
INSERT INTO superadmin_users (id, email)
SELECT id, email FROM auth.users 
WHERE email = 'rezaul990drive@gmail.com';
```

### Step 2: Super Admin Signs In

1. Super admin signs up/signs in
2. Should see "(Super Admin)" badge
3. Should see "Manage Admins" button
4. Can upload data for all areas

### Step 3: Add Area Admins

1. **Super admin clicks "Manage Admins"**
2. **Enter area admin's email**
3. **Select their area** (e.g., "Tangail")
4. **Click "Add Area Admin"**
5. Done! They are now area admin for that area

### Step 4: Area Admin Signs In

1. Area admin signs up/signs in
2. Should see "({Area} Admin)" badge
3. Can upload data for their area
4. Can only see their area's data

### Step 5: Regular Users Sign Up

1. Regular user signs up
2. Selects their Plaza
3. Can only see their Plaza's data

## Example Scenario

### Current Setup:
```
Super Admin: rezaul990drive@gmail.com
  - Can see: ALL areas
  - Can upload: ALL areas
  - Can manage: All area admins

Area Admin: tangail_admin@company.com (Tangail)
  - Can see: Only Tangail area
  - Can upload: Only Tangail area

Area Admin: dhaka_admin@company.com (Dhaka)
  - Can see: Only Dhaka area
  - Can upload: Only Dhaka area

Regular User: user1@company.com (Walton Plaza-Ghatail)
  - Can see: Only Walton Plaza-Ghatail
  - Cannot upload

Regular User: user2@company.com (Mirpur Plaza)
  - Can see: Only Mirpur Plaza
  - Cannot upload
```

### Data Upload Flow:

**Tangail Area Admin uploads:**
1. Selects 3 Excel files
2. Clicks "Upload & Save to Database"
3. Sees: "This will REPLACE all data for Tangail area"
4. Confirms
5. Only Tangail area data is replaced
6. Other areas' data remains unchanged

**Super Admin uploads:**
1. Selects 3 Excel files
2. Clicks "Upload & Save to Database"
3. Sees: "This will REPLACE ALL data in the database"
4. Confirms
5. ALL data from ALL areas is replaced

## Database Structure

### superadmin_users Table
```sql
- id (UUID) - Links to auth.users
- email (TEXT) - Super admin's email
- created_at (TIMESTAMP)
```

### admin_users Table
```sql
- id (UUID) - Links to auth.users
- email (TEXT) - Area admin's email
- area (TEXT) - Assigned area (e.g., "Tangail")
- role (TEXT) - Always 'area_admin'
- created_at (TIMESTAMP)
```

### user_profiles Table
```sql
- id (UUID) - Links to auth.users
- email (TEXT) - User's email
- plaza (TEXT) - Assigned plaza (null for admins)
- created_at (TIMESTAMP)
```

## Security (Row Level Security)

### Super Admin:
```sql
-- Can see ALL data
SELECT * FROM hire_collection_data;
-- Returns: All records from all areas
```

### Area Admin (Tangail):
```sql
-- Can see only Tangail data
SELECT * FROM hire_collection_data WHERE area = 'Tangail';
-- Returns: Only Tangail records
```

### Regular User (Walton Plaza):
```sql
-- Can see only their plaza
SELECT * FROM hire_collection_data WHERE plaza = 'Walton Plaza-Ghatail';
-- Returns: Only Walton Plaza records
```

## Adding More Area Admins

### Method 1: Via Admin Panel (Recommended)

1. Sign in as Super Admin
2. Click "Manage Admins"
3. Enter new admin's email
4. Select their area
5. Click "Add Area Admin"

### Method 2: Via SQL

```sql
-- Add area admin for Dhaka
INSERT INTO admin_users (id, email, area, role)
SELECT id, 'dhaka@company.com', 'Dhaka', 'area_admin'
FROM auth.users 
WHERE email = 'dhaka@company.com';
```

## Removing Area Admins

### Via Admin Panel:

1. Sign in as Super Admin
2. Click "Manage Admins"
3. Click "Remove" next to admin's name
4. Confirm removal

### Via SQL:

```sql
DELETE FROM admin_users WHERE email = 'admin@example.com';
```

## Testing

### Test Super Admin:
1. Add yourself as super admin (SQL)
2. Sign in
3. Should see "(Super Admin)" badge
4. Should see "Manage Admins" button
5. Should see data from all areas
6. Can upload data

### Test Area Admin:
1. Super admin adds them via admin panel
2. They sign in
3. Should see "({Area} Admin)" badge
4. Should see only their area's data
5. Can upload data for their area

### Test Regular User:
1. They sign up and select plaza
2. Should see "({Plaza})" badge
3. Should see only their plaza's data
4. Cannot upload data

## Troubleshooting

### Issue: Area admin sees no data
**Solution**: 
- Check if their area matches exactly in the database
- Area names are case-sensitive
- Check spelling

### Issue: Area admin can't upload
**Solution**:
- Verify they're in admin_users table
- Check their area is set correctly
- Sign out and sign in again

### Issue: Super admin can't add area admins
**Solution**:
- Verify they're in superadmin_users table
- Check browser console for errors
- Ensure user has signed up first

## Best Practices

### For Super Admin:
1. **Add area admins carefully** - They can modify data
2. **Use descriptive area names** - Match exactly with data
3. **Monitor uploads** - Check what area admins upload
4. **Backup data** - Before major uploads

### For Area Admins:
1. **Only upload your area's data** - System enforces this
2. **Verify data before uploading** - Check Excel files
3. **Coordinate with super admin** - For any issues
4. **Keep Excel files backed up** - In case of errors

### For Regular Users:
1. **Export data regularly** - For your records
2. **Report issues to area admin** - They manage your area
3. **Refresh after uploads** - To see new data

## Summary

✅ **Three-tier system implemented**
✅ **Super Admin**: Full access
✅ **Area Admins**: Area-specific access
✅ **Regular Users**: Plaza-specific access
✅ **Secure with RLS policies**
✅ **Easy to manage via admin panel**

**Your system is now ready for multi-area management!** 🎉
