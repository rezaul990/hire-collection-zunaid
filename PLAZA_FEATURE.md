# Plaza-Based User Management

## Overview

Users are now assigned to specific Plazas during signup. Each user can only see and manage data for their assigned Plaza.

## Features Implemented

### 1. Plaza Selection During Signup
- Plaza dropdown appears when user clicks "Sign Up"
- Dropdown is populated with existing Plazas from the database
- User must select a Plaza before creating account

### 2. No Email Verification Required
- Users can sign up and immediately access the application
- No need to check email or click verification links
- Faster onboarding process

### 3. Plaza-Based Data Access
- Users only see data for their assigned Plaza
- Row Level Security (RLS) enforces this at the database level
- Cannot access or modify data from other Plazas

### 4. User Profile Display
- User's email and Plaza shown in header
- Example: "user@example.com (Dhaka Plaza)"

## Database Changes

### New Table: `user_profiles`
```sql
- id (UUID) - Links to auth.users
- email (TEXT) - User's email
- plaza (TEXT) - Assigned Plaza
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### New Function: `get_available_plazas()`
Returns list of all unique Plazas from existing data for the signup dropdown.

### Updated RLS Policies
**hire_collection_data table:**
- Users can only SELECT data where plaza matches their profile
- Users can only INSERT data for their assigned plaza

## User Flow

### Sign Up
1. User clicks "Sign Up"
2. Enters email and password
3. Selects Plaza from dropdown
4. Clicks "Sign Up"
5. Account created instantly
6. Automatically signed in
7. Sees only their Plaza's data

### Sign In
1. User enters email and password
2. Clicks "Sign In"
3. Sees only their Plaza's data

## Security

### Data Isolation
- **Database Level**: RLS policies prevent cross-plaza data access
- **Application Level**: Queries filtered by user's plaza
- **API Level**: Supabase enforces RLS on all requests

### Benefits
- ✅ Each Plaza manager sees only their data
- ✅ No accidental data mixing
- ✅ Secure multi-tenant architecture
- ✅ Scalable for many Plazas

## Configuration Required

### Supabase Dashboard Settings

**IMPORTANT**: You must disable email confirmation in Supabase:

1. Go to: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx
2. Navigate to: **Authentication** → **Providers** → **Email**
3. Find: **"Confirm email"** setting
4. **DISABLE** it
5. Click **Save**

Without this step, users will need to verify their email before accessing the app.

## Testing

### Test Scenario 1: Sign Up
1. Click "Sign Up"
2. Enter: test@plaza1.com / password123
3. Select: "Plaza 1" from dropdown
4. Click "Sign Up"
5. ✅ Should be signed in immediately
6. ✅ Should see "test@plaza1.com (Plaza 1)" in header

### Test Scenario 2: Data Isolation
1. Sign up user1 with Plaza A
2. Upload data for Plaza A
3. Sign out
4. Sign up user2 with Plaza B
5. ✅ User2 should NOT see Plaza A's data
6. Upload data for Plaza B
7. ✅ User2 should only see Plaza B's data

### Test Scenario 3: Plaza Dropdown
1. Ensure you have data with different Plazas in database
2. Click "Sign Up"
3. ✅ Dropdown should show all unique Plaza names
4. ✅ Should be sorted alphabetically

## Troubleshooting

### Issue: Plaza dropdown is empty
**Solution**: Make sure you have uploaded data with Plaza values first. The dropdown pulls from existing data.

### Issue: User can see all data
**Solution**: 
1. Check RLS policies are enabled
2. Verify user_profiles table has correct plaza value
3. Check browser console for errors

### Issue: Email verification required
**Solution**: Disable email confirmation in Supabase dashboard (see Configuration section above)

### Issue: Sign up fails
**Solution**:
1. Check if Plaza is selected
2. Verify password is at least 6 characters
3. Check browser console for errors
4. Ensure user_profiles table exists

## Future Enhancements

### Possible Additions
- [ ] Admin role to see all Plazas
- [ ] Multi-plaza access for managers
- [ ] Plaza transfer functionality
- [ ] Plaza-level analytics
- [ ] Plaza comparison reports

## Migration for Existing Users

If you already have users without Plaza assignments:

```sql
-- Option 1: Assign all existing users to a default Plaza
INSERT INTO user_profiles (id, email, plaza)
SELECT id, email, 'Default Plaza'
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles);

-- Option 2: Let users select Plaza on first login
-- (Requires additional UI implementation)
```

## Summary

✅ **Plaza-based user management implemented**
✅ **No email verification required**
✅ **Secure data isolation**
✅ **Easy signup process**
✅ **Scalable architecture**

Users can now sign up, select their Plaza, and immediately start working with their Plaza's data!
