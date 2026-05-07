# Multi-Area System - How It Works

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN                              │
│              rezaul990drive@gmail.com                       │
│                                                             │
│  Can see: ALL areas                                         │
│  Can upload: ALL areas                                      │
│  Upload replaces: ALL data                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Manages both area admins
                     │
        ┌────────────┴────────────┐
        │                         │
        │                         │
┌───────▼──────────┐      ┌──────▼───────────┐
│  AREA ADMIN      │      │  AREA ADMIN      │
│  tangail@rcm.com │      │ ctgwest@rcm.com  │
│  (Tangail Area)  │      │ (CTG West Area)  │
│                  │      │                  │
│  Can see:        │      │  Can see:        │
│  Tangail only    │      │  CTG West only   │
│                  │      │                  │
│  Can upload:     │      │  Can upload:     │
│  Tangail only    │      │  CTG West only   │
│                  │      │                  │
│  Replaces:       │      │  Replaces:       │
│  Tangail only    │      │  CTG West only   │
└───────┬──────────┘      └──────┬───────────┘
        │                        │
        │                        │
   ┌────┴────┐              ┌────┴────┐
   │ USERS   │              │ USERS   │
   │ (Plaza) │              │ (Plaza) │
   └─────────┘              └─────────┘
```

---

## Data Storage - Separate by Area

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE                                 │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │   TANGAIL AREA       │  │   CTG WEST AREA      │       │
│  │                      │  │                      │       │
│  │  5,659 records       │  │  (to be added)       │       │
│  │  17 plazas           │  │                      │       │
│  │                      │  │                      │       │
│  │  Managed by:         │  │  Managed by:         │       │
│  │  tangail@rcm.com     │  │  ctgwest@rcm.com     │       │
│  └──────────────────────┘  └──────────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Upload Flow - Area Admin

### Scenario 1: tangail@rcm.com Uploads

```
┌─────────────────────────────────────────────────────────────┐
│  tangail@rcm.com clicks "Upload New Data"                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Selects 3 Excel files for Tangail Area                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Confirmation: "This will REPLACE all data for              │
│                 Tangail Area. Are you sure?"                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  System deletes ONLY Tangail Area data                     │
│  DELETE FROM hire_collection_data WHERE area = 'Tangail'   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  System inserts new Tangail Area data                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  RESULT:                                                    │
│  ✅ Tangail Area: NEW data                                  │
│  ✅ CTG West Area: UNCHANGED                                │
└─────────────────────────────────────────────────────────────┘
```

### Scenario 2: ctgwest@rcm.com Uploads

```
┌─────────────────────────────────────────────────────────────┐
│  ctgwest@rcm.com clicks "Upload New Data"                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Selects 3 Excel files for CTG West Area                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Confirmation: "This will REPLACE all data for              │
│                 CTG West Area. Are you sure?"               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  System deletes ONLY CTG West Area data                    │
│  DELETE FROM hire_collection_data WHERE area = 'CTG West'  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  System inserts new CTG West Area data                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  RESULT:                                                    │
│  ✅ Tangail Area: UNCHANGED                                 │
│  ✅ CTG West Area: NEW data                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Upload Flow - Super Admin

### Scenario 3: Super Admin Uploads

```
┌─────────────────────────────────────────────────────────────┐
│  rezaul990drive@gmail.com clicks "Upload New Data"          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Selects 3 Excel files (can contain multiple areas)        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Confirmation: "This will REPLACE ALL data in the           │
│                 database. Are you sure?"                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  System deletes ALL data from ALL areas                    │
│  DELETE FROM hire_collection_data (all records)            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  System inserts new data for ALL areas                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  RESULT:                                                    │
│  ✅ Tangail Area: NEW data                                  │
│  ✅ CTG West Area: NEW data                                 │
│  ✅ ALL areas: REPLACED                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Timeline Example

### Day 1: Initial Setup
```
Database:
├── Tangail Area: 5,659 records (tangail@rcm.com uploaded)
└── CTG West Area: 0 records (not uploaded yet)
```

### Day 2: CTG West Admin Uploads
```
Database:
├── Tangail Area: 5,659 records (unchanged)
└── CTG West Area: 3,000 records (ctgwest@rcm.com uploaded)
```

### Day 3: Tangail Admin Re-uploads
```
Database:
├── Tangail Area: 5,800 records (tangail@rcm.com replaced)
└── CTG West Area: 3,000 records (unchanged)
```

### Day 4: CTG West Admin Re-uploads
```
Database:
├── Tangail Area: 5,800 records (unchanged)
└── CTG West Area: 3,200 records (ctgwest@rcm.com replaced)
```

### Day 5: Super Admin Uploads All
```
Database:
├── Tangail Area: 6,000 records (super admin replaced all)
└── CTG West Area: 3,500 records (super admin replaced all)
```

---

## Data Isolation

### What Each User Sees

**Super Admin (rezaul990drive@gmail.com):**
```sql
SELECT * FROM hire_collection_data;
-- Returns: ALL records from ALL areas
-- Tangail Area: 5,659 records
-- CTG West Area: 3,000 records
-- Total: 8,659 records
```

**Tangail Area Admin (tangail@rcm.com):**
```sql
SELECT * FROM hire_collection_data WHERE area = 'Tangail Area';
-- Returns: ONLY Tangail Area records
-- Tangail Area: 5,659 records
-- Cannot see CTG West Area
```

**CTG West Area Admin (ctgwest@rcm.com):**
```sql
SELECT * FROM hire_collection_data WHERE area = 'CTG West Area';
-- Returns: ONLY CTG West Area records
-- CTG West Area: 3,000 records
-- Cannot see Tangail Area
```

**Regular User (plaza-based):**
```sql
SELECT * FROM hire_collection_data WHERE plaza = 'Walton Plaza-Ghatail';
-- Returns: ONLY their plaza records
-- Walton Plaza-Ghatail: ~300 records
-- Cannot see other plazas or areas
```

---

## Security Implementation

### Row Level Security (RLS) Policies

**For Super Admin:**
```sql
CREATE POLICY "Super admins can see all data"
ON hire_collection_data FOR SELECT
USING (
  auth.uid() IN (SELECT id FROM superadmin_users)
);
```

**For Area Admin:**
```sql
CREATE POLICY "Area admins can see their area"
ON hire_collection_data FOR SELECT
USING (
  area IN (
    SELECT area FROM admin_users 
    WHERE id = auth.uid()
  )
);
```

**For Regular User:**
```sql
CREATE POLICY "Users can see their plaza"
ON hire_collection_data FOR SELECT
USING (
  plaza IN (
    SELECT plaza FROM user_profiles 
    WHERE id = auth.uid()
  )
);
```

---

## Benefits of Multi-Area System

### ✅ Data Isolation
- Each area admin manages their own data
- No risk of accidentally modifying other areas
- Clear ownership and responsibility

### ✅ Independent Updates
- Tangail admin can update anytime
- CTG West admin can update anytime
- No coordination needed between area admins

### ✅ Scalability
- Easy to add more areas
- Easy to add more area admins
- System handles any number of areas

### ✅ Security
- Database-level access control (RLS)
- Cannot be bypassed
- Each user sees only their authorized data

### ✅ Flexibility
- Super admin can see all areas
- Super admin can upload for all areas
- Area admins work independently

---

## Adding More Areas

### Process:
1. **User signs up** (e.g., dhaka@rcm.com)
2. **Super admin adds them** as area admin for new area
3. **They upload data** for their area
4. **System stores separately** from other areas

### Example: Adding Dhaka Area
```sql
-- After dhaka@rcm.com signs up
INSERT INTO admin_users (id, email, area, role)
SELECT id, email, 'Dhaka Area', 'area_admin'
FROM auth.users 
WHERE email = 'dhaka@rcm.com';
```

Result:
```
Database:
├── Tangail Area: 5,659 records (tangail@rcm.com)
├── CTG West Area: 3,000 records (ctgwest@rcm.com)
└── Dhaka Area: 4,500 records (dhaka@rcm.com)
```

---

## Summary

✅ **Multi-area support**: Already implemented  
✅ **Separate storage**: Each area has its own data  
✅ **Independent uploads**: Area admins work independently  
✅ **Data isolation**: RLS policies enforce access control  
✅ **Scalable**: Can add unlimited areas  

**The system is ready for multiple areas!** 🎉
