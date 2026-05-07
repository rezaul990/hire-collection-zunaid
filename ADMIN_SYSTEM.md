# Admin System Documentation

## Overview

The system now has two types of users:
1. **Admins** - Can upload data and see all Plazas
2. **Regular Users** - Can only view data for their assigned Plaza

## Current Admin

**Email**: rezaul990drive@gmail.com

This admin account will be automatically created when this email signs up.

## Admin Capabilities

### What Admins Can Do:
✅ Upload Excel files (Target, Current Overdue, Previous Overdue)
✅ See data from ALL Plazas
✅ Add new admins
✅ Manage admin list
✅ Export data from all Plazas

### What Admins See:
- "Admin" badge next to their email in header
- "Upload New Data" button (always visible)
- "Manage Admins" button in header
- All data from all Plazas in the dashboard

## Regular User Capabilities

### What Regular Users Can Do:
✅ View data for their assigned Plaza only
✅ Filter and search within their Plaza
✅ Export data for their Plaza
✅ Use all dashboard features

### What Regular Users CANNOT Do:
❌ Upload new data
❌ See data from other Plazas
❌ Add admins
❌ Access admin panel

### What Regular Users See:
- Their Plaza name next to email: "user@example.com (Plaza Name)"
- NO "Upload New Data" button
- NO "Manage Admins" button
- Only their Plaza's data

## How to Add More Admins

### Method 1: Using Admin Panel (Recommended)

1. **Sign in as admin** (rezaul990drive@gmail.com)
2. **Click "Manage Admins"** button in header
3. **Enter new admin's email**
4. **Click "Add Admin"**
5. Done! They are now an admin

**Note**: The user must have signed up first before you can make them an admin.

### Method 2: Using SQL (Advanced)

```sql
-- Add admin by email
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users 
WHERE email = 'newadmin@example.com';
```

## User Signup Process

### For Admin (rezaul990drive@gmail.com):
1. Go to signup page
2. Enter: rezaul990drive@gmail.com
3. Enter password
4. Select any Plaza (or leave empty)
5. Click "Sign Up"
6. **Automatically becomes admin**
7. Can upload data and see all Plazas

### For Regular Users:
1. Go to signup page
2. Enter their email
3. Enter password
4. **Must select their Plaza**
5. Click "Sign Up"
6. Can only see their Plaza's data

## Database Structure

### admin_users Table
```sql
- id (UUID) - Links to auth.users
- email (TEXT) - Admin's email
- created_at (TIMESTAMP) - When admin was added
```

### Security Policies

**Uploads Table**:
- Only admins can INSERT
- Users can SELECT uploads containing their Plaza's data

**hire_collection_data Table**:
- Only admins can INSERT
- Admins can SELECT all data
- Regular users can SELECT only their Plaza's data

**user_profiles Table**:
- Plaza is optional (for admins)
- Plaza is required for regular users

## Testing

### Test Admin Access:
1. Sign up with rezaul990drive@gmail.com
2. Should see "(Admin)" badge
3. Should see "Upload New Data" button
4. Should see "Manage Admins" button
5. Should see data from all Plazas

### Test Regular User Access:
1. Sign up with any other email
2. Select a Plaza
3. Should see "(Plaza Name)" badge
4. Should NOT see "Upload New Data" button
5. Should NOT see "Manage Admins" button
6. Should only see their Plaza's data

## Adding Second Admin

When you want to add another admin later:

1. **Have them sign up first** with their email
2. **Sign in as rezaul990drive@gmail.com**
3. **Click "Manage Admins"**
4. **Enter their email**
5. **Click "Add Admin"**
6. **They become admin immediately**
7. **They need to sign out and sign in again** to see admin features

## Removing Admins

To remove an admin (SQL only for now):

```sql
DELETE FROM admin_users WHERE email = 'admin@example.com';
```

The user will still exist but will lose admin privileges.

## Security Notes

### Admin Detection:
- Checked on every login
- Stored in `isAdmin` variable
- Determines UI visibility
- Enforced at database level with RLS

### Data Access:
- **Database Level**: RLS policies enforce access control
- **Application Level**: UI hides/shows features based on role
- **Cannot be bypassed**: Even if someone modifies frontend code

### Upload Restrictions:
- Only admins can upload
- Enforced at database level
- Regular users get error if they try

## Troubleshooting

### Issue: Admin can't upload
**Solution**: 
1. Check if email is in admin_users table
2. Sign out and sign in again
3. Check browser console for errors

### Issue: Regular user sees upload button
**Solution**:
1. Refresh the page
2. Check if they're actually in admin_users table
3. Clear browser cache

### Issue: Can't add new admin
**Solution**:
1. Make sure the user has signed up first
2. Check spelling of email address
3. Check if they're already an admin

## Summary

✅ **Admin system implemented**
✅ **rezaul990drive@gmail.com is the first admin**
✅ **Admins can upload and see all data**
✅ **Regular users see only their Plaza**
✅ **Easy to add more admins**
✅ **Secure with RLS policies**

The system is ready to use! 🎉
