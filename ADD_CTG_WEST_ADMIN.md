# Adding CTG West Area Admin

## Overview

**New Area Admin**: ctgwest@rcm.com  
**Area**: CTG West Area  
**Status**: ⏳ Waiting for user to sign up

---

## How Multi-Area System Works

### ✅ Already Implemented

The system is **already designed** to handle multiple areas separately:

1. **Each area admin uploads their own data**
   - tangail@rcm.com uploads → Tangail Area data
   - ctgwest@rcm.com uploads → CTG West Area data

2. **Data is stored separately by area**
   - Tangail Area: 5,659 records
   - CTG West Area: (will be added when ctgwest@rcm.com uploads)

3. **Area admin uploads replace only their area**
   - When tangail@rcm.com uploads again → Only Tangail Area data is replaced
   - When ctgwest@rcm.com uploads again → Only CTG West Area data is replaced
   - Other areas remain unchanged

4. **Super admin can see all areas**
   - rezaul990drive@gmail.com sees both Tangail Area and CTG West Area

---

## Current System State

### Areas in Database
| Area | Records | Area Admin |
|------|---------|------------|
| Tangail Area | 5,659 | tangail@rcm.com ✅ |
| CTG West Area | 0 | ctgwest@rcm.com ⏳ (needs to sign up) |

### User Hierarchy
```
SUPER ADMIN
└── rezaul990drive@gmail.com (All areas)
    │
    ├── AREA ADMIN (Tangail Area)
    │   └── tangail@rcm.com ✅
    │       └── 5,659 records
    │
    └── AREA ADMIN (CTG West Area)
        └── ctgwest@rcm.com ⏳
            └── 0 records (will upload)
```

---

## Steps to Add ctgwest@rcm.com

### Step 1: User Signs Up ⏳ (Required First)

**ctgwest@rcm.com must do this:**

1. Go to the web app
2. Click **Sign Up**
3. Enter:
   - Email: `ctgwest@rcm.com`
   - Password: (choose a strong password)
   - Plaza: (select any plaza - doesn't matter, will be removed)
4. Click **Sign Up**
5. Sign in

**Status**: ⏳ Waiting for this step

---

### Step 2: Add as Area Admin ✅ (I can do this via MCP)

**After ctgwest@rcm.com signs up**, run this SQL via Supabase MCP:

```sql
-- Add ctgwest@rcm.com as CTG West Area admin
INSERT INTO admin_users (id, email, area, role)
SELECT id, email, 'CTG West Area', 'area_admin'
FROM auth.users 
WHERE email = 'ctgwest@rcm.com'
ON CONFLICT (id) DO UPDATE 
SET area = 'CTG West Area', role = 'area_admin';

-- Remove plaza from profile (admins don't need plaza)
UPDATE user_profiles 
SET plaza = NULL 
WHERE id = (SELECT id FROM auth.users WHERE email = 'ctgwest@rcm.com');

-- Verify
SELECT 
  'Area Admin' as role,
  email,
  area
FROM admin_users
ORDER BY area;
```

**Status**: ✅ Ready to execute once user signs up

---

### Step 3: User Signs Out and Signs In

**ctgwest@rcm.com must do this:**

1. Sign out from web app
2. Sign in again
3. Should see: `ctgwest@rcm.com (CTG West Area Admin)` ✅

---

### Step 4: Upload CTG West Area Data

**ctgwest@rcm.com can now:**

1. Click **Upload New Data**
2. Select 3 Excel files for CTG West Area:
   - Target / Collection Excel
   - Current Overdue Excel
   - Previous Overdue Excel
3. Click **Upload & Save to Database**
4. Confirm: "This will REPLACE all data for CTG West Area"
5. Wait for upload to complete

**Result:**
- ✅ CTG West Area data is saved
- ✅ Tangail Area data remains unchanged
- ✅ Super admin can see both areas

---

## How Data Replacement Works

### Example Scenario

**Initial State:**
```
Database:
├── Tangail Area: 5,659 records (tangail@rcm.com)
└── CTG West Area: 0 records
```

**After ctgwest@rcm.com uploads (first time):**
```
Database:
├── Tangail Area: 5,659 records (unchanged)
└── CTG West Area: 3,000 records (new)
```

**After ctgwest@rcm.com uploads again (second time):**
```
Database:
├── Tangail Area: 5,659 records (unchanged)
└── CTG West Area: 3,200 records (replaced old 3,000)
```

**After tangail@rcm.com uploads again:**
```
Database:
├── Tangail Area: 5,800 records (replaced old 5,659)
└── CTG West Area: 3,200 records (unchanged)
```

**After super admin uploads:**
```
Database:
├── Tangail Area: 6,000 records (replaced)
└── CTG West Area: 3,500 records (replaced)
(ALL areas replaced)
```

---

## Code Implementation (Already Done)

### Upload Logic in app.js

The code already handles area-specific replacement:

```javascript
if (isSuperAdmin) {
  // Super admin deletes ALL data
  await supabaseClient
    .from('hire_collection_data')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
    
} else if (userRole === 'area_admin' && userArea) {
  // Area admin deletes only their area's data
  await supabaseClient
    .from('hire_collection_data')
    .delete()
    .eq('area', userArea);  // ← Only deletes their area
}
```

### Confirmation Messages

- **Super Admin**: "This will REPLACE ALL data in the database. Are you sure?"
- **Area Admin**: "This will REPLACE all data for {Area} area. Are you sure?"

---

## Permissions Matrix

| User | Email | Area | Can Upload | Upload Replaces | Can See |
|------|-------|------|------------|-----------------|---------|
| Super Admin | rezaul990drive@gmail.com | All | ✅ All areas | ALL data | All areas |
| Area Admin | tangail@rcm.com | Tangail Area | ✅ Tangail only | Tangail only | Tangail only |
| Area Admin | ctgwest@rcm.com | CTG West Area | ✅ CTG West only | CTG West only | CTG West only |
| Regular User | (various) | N/A | ❌ No | N/A | Their plaza only |

---

## Testing Checklist

### After Adding ctgwest@rcm.com:

- [ ] ctgwest@rcm.com signs up
- [ ] Super admin adds them as area admin (via SQL or admin panel)
- [ ] ctgwest@rcm.com signs out and signs in
- [ ] Verify badge shows "(CTG West Area Admin)"
- [ ] Verify "Upload New Data" button is visible
- [ ] Upload CTG West Area data
- [ ] Verify CTG West Area data appears
- [ ] Verify Tangail Area data is unchanged
- [ ] Upload again to test replacement
- [ ] Verify only CTG West Area data is replaced

### Verify Other Admins Unaffected:

- [ ] tangail@rcm.com signs in
- [ ] Verify still sees only Tangail Area data
- [ ] Verify Tangail Area data is unchanged
- [ ] Upload Tangail Area data
- [ ] Verify only Tangail Area data is replaced
- [ ] Verify CTG West Area data is unchanged

---

## Quick Commands

### Check Current State
```sql
SELECT 
  area,
  COUNT(*) as records,
  COUNT(DISTINCT plaza) as plazas
FROM hire_collection_data
GROUP BY area
ORDER BY area;
```

### Check Area Admins
```sql
SELECT 
  email,
  area,
  role
FROM admin_users
ORDER BY area;
```

### Add CTG West Admin (after signup)
```sql
INSERT INTO admin_users (id, email, area, role)
SELECT id, email, 'CTG West Area', 'area_admin'
FROM auth.users 
WHERE email = 'ctgwest@rcm.com';
```

---

## Summary

✅ **System Design**: Already supports multiple areas separately  
✅ **Code Implementation**: Already handles area-specific replacement  
✅ **Current Areas**: Tangail Area (5,659 records)  
⏳ **New Area**: CTG West Area (waiting for ctgwest@rcm.com to sign up)  
⏳ **New Admin**: ctgwest@rcm.com (needs to sign up first)  

**Next Action**: ctgwest@rcm.com needs to sign up, then I can add them as area admin via MCP.

---

## Contact Me When Ready

**When ctgwest@rcm.com has signed up**, let me know and I will:
1. Add them as area admin via Supabase MCP
2. Verify the setup
3. Provide instructions for their first upload

**The system is ready for multiple areas!** 🎉
