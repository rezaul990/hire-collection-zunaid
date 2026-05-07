# Quick Setup - Super Admin

## 🚀 Fast Track Setup (5 Minutes)

### Prerequisites
- Supabase project created
- Web app deployed
- Database tables created

---

## Step 1: Disable Email Confirmation
**Supabase Dashboard** → Authentication → Providers → Email → **Disable "Confirm email"** → Save

---

## Step 2: Create Database Function
**Supabase Dashboard** → SQL Editor → New Query → Run this:

```sql
CREATE OR REPLACE FUNCTION get_available_areas()
RETURNS TABLE (area TEXT) AS $$
  SELECT DISTINCT area FROM hire_collection_data 
  WHERE area IS NOT NULL AND area != ''
  ORDER BY area;
$$ LANGUAGE SQL STABLE;
```

---

## Step 3: Sign Up Super Admin
**Web App** → Sign Up:
- Email: `rezaul990drive@gmail.com`
- Password: (your password)
- Plaza: (any or empty)

---

## Step 4: Activate Super Admin
**Supabase Dashboard** → SQL Editor → New Query → Run this:

```sql
INSERT INTO superadmin_users (id, email)
SELECT id, email FROM auth.users 
WHERE email = 'rezaul990drive@gmail.com'
ON CONFLICT (id) DO NOTHING;

DELETE FROM admin_users WHERE email = 'rezaul990drive@gmail.com';

SELECT * FROM superadmin_users;
```

---

## Step 5: Verify
**Web App** → Sign out → Sign in as rezaul990drive@gmail.com

**You should see:**
- ✅ "(Super Admin)" badge
- ✅ "Manage Admins" button
- ✅ "Upload New Data" button

---

## ✅ Done!

Now you can:
- Upload data for all areas
- Add area admins via "Manage Admins"
- Manage the entire system

---

## Quick Commands

### Add Area Admin (via Admin Panel):
1. Click "Manage Admins"
2. Enter email + select area
3. Click "Add Area Admin"

### Upload Data:
1. Click "Upload New Data"
2. Select 3 Excel files
3. Click "Upload & Save to Database"

---

## Need Help?
See `COMPLETE_SETUP_GUIDE.md` for detailed instructions.
