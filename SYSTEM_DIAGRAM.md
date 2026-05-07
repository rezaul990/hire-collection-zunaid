# System Architecture Diagram

## Three-Tier User Hierarchy

```
                    ┌─────────────────────────────────────────┐
                    │         SUPER ADMIN                     │
                    │   rezaul990drive@gmail.com              │
                    │                                         │
                    │   Capabilities:                         │
                    │   ✅ View ALL areas                     │
                    │   ✅ Upload data for ALL areas          │
                    │   ✅ Manage area admins                 │
                    │   ✅ Add/remove area admins             │
                    │   ✅ Access admin panel                 │
                    │                                         │
                    │   Badge: "(Super Admin)"                │
                    └──────────────┬──────────────────────────┘
                                   │
                                   │ Manages
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    │                             │
        ┌───────────▼──────────┐      ┌──────────▼───────────┐
        │   AREA ADMIN         │      │   AREA ADMIN         │
        │   (Tangail)          │      │   (Dhaka)            │
        │                      │      │                      │
        │   Capabilities:      │      │   Capabilities:      │
        │   ✅ View Tangail    │      │   ✅ View Dhaka      │
        │   ✅ Upload Tangail  │      │   ✅ Upload Dhaka    │
        │   ❌ View other areas│      │   ❌ View other areas│
        │   ❌ Manage admins   │      │   ❌ Manage admins   │
        │                      │      │                      │
        │   Badge:             │      │   Badge:             │
        │   "(Tangail Admin)"  │      │   "(Dhaka Admin)"    │
        └───────────┬──────────┘      └──────────┬───────────┘
                    │                            │
                    │ Oversees                   │ Oversees
                    │                            │
        ┌───────────┴──────────┐     ┌──────────┴───────────┐
        │                      │     │                      │
    ┌───▼────┐  ┌───▼────┐   ┌▼────▼┐  ┌────▼───┐
    │ USER   │  │ USER   │   │ USER │  │ USER   │
    │ Plaza1 │  │ Plaza2 │   │Plaza3│  │ Plaza4 │
    │        │  │        │   │      │  │        │
    │ View   │  │ View   │   │ View │  │ View   │
    │ Only   │  │ Only   │   │ Only │  │ Only   │
    └────────┘  └────────┘   └──────┘  └────────┘
```

---

## Data Flow Diagram

### Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN UPLOAD                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Uploads 3 Excel files
                              ▼
                    ┌─────────────────────┐
                    │  Delete ALL data    │
                    │  from database      │
                    └──────────┬──────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Insert new data    │
                    │  for ALL areas      │
                    └──────────┬──────────┘
                              │
                              ▼
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────┐                          ┌───────────────┐
│ Tangail Data  │                          │  Dhaka Data   │
│   Replaced    │                          │   Replaced    │
└───────────────┘                          └───────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    AREA ADMIN UPLOAD                        │
│                      (Tangail)                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Uploads 3 Excel files
                              ▼
                    ┌─────────────────────┐
                    │  Delete ONLY        │
                    │  Tangail data       │
                    └──────────┬──────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Insert new data    │
                    │  for Tangail only   │
                    └──────────┬──────────┘
                              │
                              ▼
                    ┌───────────────┐
                    │ Tangail Data  │
                    │   Replaced    │
                    └───────────────┘

                    ┌───────────────┐
                    │  Dhaka Data   │
                    │  Unchanged    │ ← Other areas not affected
                    └───────────────┘
```

---

## Data Access Diagram

### Who Can See What?

```
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                             │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Tangail Area │  │  Dhaka Area  │  │ Sylhet Area  │    │
│  │              │  │              │  │              │    │
│  │ Plaza A      │  │ Plaza D      │  │ Plaza G      │    │
│  │ Plaza B      │  │ Plaza E      │  │ Plaza H      │    │
│  │ Plaza C      │  │ Plaza F      │  │ Plaza I      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
         │                   │                   │
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    ACCESS CONTROL (RLS)                     │
└─────────────────────────────────────────────────────────────┘
         │                   │                   │
         │                   │                   │
    ┌────┴────┐         ┌────┴────┐        ┌────┴────┐
    │         │         │         │        │         │
    ▼         ▼         ▼         ▼        ▼         ▼

┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ SUPER   │ │ Tangail │ │  Dhaka  │ │ Sylhet  │ │  User   │
│ ADMIN   │ │  Admin  │ │  Admin  │ │  Admin  │ │ Plaza A │
│         │ │         │ │         │ │         │ │         │
│ Sees:   │ │ Sees:   │ │ Sees:   │ │ Sees:   │ │ Sees:   │
│ ALL     │ │ Tangail │ │ Dhaka   │ │ Sylhet  │ │ Plaza A │
│ 3 areas │ │ only    │ │ only    │ │ only    │ │ only    │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      USER VISITS SITE                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Already signed in? │
                    └──────────┬──────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                   YES                 NO
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐  ┌───────────────────┐
        │  Load user role   │  │  Show login page  │
        └─────────┬─────────┘  └─────────┬─────────┘
                  │                      │
                  │                      │ Sign in/up
                  │                      │
                  │                      ▼
                  │            ┌───────────────────┐
                  │            │ Check user email  │
                  │            │ in database       │
                  │            └─────────┬─────────┘
                  │                      │
                  └──────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Determine role:    │
                    │  1. Super admin?    │
                    │  2. Area admin?     │
                    │  3. Regular user?   │
                    └──────────┬──────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            Super Admin          Area Admin
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐  ┌───────────────────┐
        │ Show:             │  │ Show:             │
        │ • All data        │  │ • Area data       │
        │ • Upload button   │  │ • Upload button   │
        │ • Manage admins   │  │ • No admin panel  │
        └───────────────────┘  └───────────────────┘
                    │
                    │
            Regular User
                    │
                    ▼
        ┌───────────────────┐
        │ Show:             │
        │ • Plaza data      │
        │ • No upload       │
        │ • No admin panel  │
        └───────────────────┘
```

---

## Admin Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│         SUPER ADMIN CLICKS "MANAGE ADMINS"                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Open admin panel   │
                    │  Load:              │
                    │  • Available areas  │
                    │  • Current admins   │
                    └──────────┬──────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Super admin        │
                    │  enters:            │
                    │  • Email            │
                    │  • Area             │
                    └──────────┬──────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Check if user      │
                    │  exists in auth     │
                    └──────────┬──────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                  YES                  NO
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐  ┌───────────────────┐
        │ Add to            │  │ Show error:       │
        │ admin_users       │  │ "User must sign   │
        │ table             │  │  up first"        │
        └─────────┬─────────┘  └───────────────────┘
                  │
                  ▼
        ┌───────────────────┐
        │ Update user       │
        │ profile:          │
        │ • Set plaza=null  │
        │ • Set area        │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │ Success!          │
        │ User is now       │
        │ area admin        │
        └───────────────────┘
```

---

## Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      auth.users                             │
│  (Supabase built-in authentication table)                  │
│                                                             │
│  • id (UUID)                                                │
│  • email                                                    │
│  • encrypted_password                                       │
│  • created_at                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Referenced by
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ superadmin_  │ │ admin_   │ │ user_    │ │ uploads  │
│ users        │ │ users    │ │ profiles │ │          │
│              │ │          │ │          │ │          │
│ • id (FK)    │ │ • id(FK) │ │ • id(FK) │ │ • id     │
│ • email      │ │ • email  │ │ • email  │ │ • user_id│
│ • created_at │ │ • area   │ │ • plaza  │ │ • files  │
└──────────────┘ │ • role   │ │ • date   │ └────┬─────┘
                 │ • date   │ └──────────┘      │
                 └──────────┘                   │
                                                │
                                                │ Referenced by
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ hire_collection_data  │
                                    │                       │
                                    │ • id                  │
                                    │ • upload_batch_id(FK) │
                                    │ • division            │
                                    │ • area                │
                                    │ • plaza               │
                                    │ • account_no          │
                                    │ • customer_name       │
                                    │ • ... (all fields)    │
                                    └───────────────────────┘
```

---

## Security Layer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  (Frontend - index.html, app.js)                           │
│                                                             │
│  • Shows/hides UI elements based on role                   │
│  • Upload button visibility                                │
│  • Admin panel visibility                                  │
│  • Badge display                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Makes API calls
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE API LAYER                       │
│  (REST API with authentication)                            │
│                                                             │
│  • Validates JWT token                                     │
│  • Identifies user                                         │
│  • Passes to database                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Enforces policies
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                           │
│  (PostgreSQL with Row Level Security)                      │
│                                                             │
│  RLS Policies:                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ IF user IN superadmin_users                          │  │
│  │   THEN show ALL data                                 │  │
│  │ ELSE IF user IN admin_users                          │  │
│  │   THEN show data WHERE area = user.area              │  │
│  │ ELSE                                                 │  │
│  │   THEN show data WHERE plaza = user.plaza            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  • Cannot be bypassed                                      │
│  • Enforced at database level                              │
│  • Works even if frontend is modified                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

This three-tier system provides:

✅ **Hierarchical access control**  
✅ **Area-based data isolation**  
✅ **Plaza-based data isolation**  
✅ **Secure at database level**  
✅ **Easy to manage**  
✅ **Scalable architecture**

**Super Admin**: rezaul990drive@gmail.com  
**Setup Guide**: See QUICK_SETUP.md
