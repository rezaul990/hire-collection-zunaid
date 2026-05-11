# Reza Branch - Separate Deployment Guide

**Branch**: Reza  
**Purpose**: Development and testing before merging to main  
**Status**: ✅ Created and pushed to GitHub

---

## 🎯 BRANCH STRATEGY

### Current Setup:
```
main branch (Production)
  └─ Commit: b205f9d - "Fix overdue matching logic - CRITICAL BUG FIX"
  
Reza branch (Development/Testing)
  └─ Commit: b370aaf - "Add documentation: Current status, next steps, and Vercel deployment fix"
  └─ Based on: main branch (includes all fixes)
```

### Purpose:
- ✅ Test changes independently before merging to main
- ✅ Deploy to separate Vercel environment
- ✅ Verify everything works correctly
- ✅ Merge to main only after approval

---

## 🚀 DEPLOY REZA BRANCH TO VERCEL

### Option 1: Create New Vercel Project (Recommended)

**Step 1: Create New Project**
1. Go to: https://vercel.com/dashboard
2. Click: **Add New** → **Project**
3. Select repository: **hire-collection-zunaid**
4. Click: **Import**

**Step 2: Configure Project**
1. **Project Name**: `hire-collection-zunaid-reza` (or any name you prefer)
2. **Framework Preset**: Other
3. **Root Directory**: `./`
4. **Build Command**: `node create-config.js`
5. **Output Directory**: Leave empty (uses root)

**Step 3: Set Branch**
1. In **Git** section, set **Production Branch** to: `Reza`
2. This ensures only the Reza branch deploys to this project

**Step 4: Add Environment Variables**
```
SUPABASE_URL = https://npakqmqmysiacdwjqdnx.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wYWtxbXFteXNpYWNkd2pxZG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNjQ2NjMsImV4cCI6MjA5MzY0MDY2M30.QqjQvsjUoR37nb_94202m-LB-sxm_H10XqmguXlexI4
```

**Step 5: Deploy**
1. Click: **Deploy**
2. Wait for deployment to complete
3. You'll get a URL like: `https://hire-collection-zunaid-reza.vercel.app`

---

### Option 2: Use Existing Project with Branch Deploy

**Step 1: Configure Existing Project**
1. Go to: https://vercel.com/dashboard
2. Select: **hire-collection-zunaid** project
3. Go to: **Settings** → **Git**

**Step 2: Enable Branch Deploys**
1. Under **Deploy Hooks**, you can create a hook for the Reza branch
2. Or simply push to Reza branch and Vercel will auto-deploy as preview

**Step 3: Access Reza Branch Deployment**
1. Go to: **Deployments** tab
2. Find deployment from **Reza** branch
3. Click to view the preview URL
4. URL will be like: `https://hire-collection-zunaid-git-reza-yourname.vercel.app`

---

## 🔧 CONFIGURE SUPABASE FOR REZA DEPLOYMENT

### Add Reza Branch URL to Supabase

**Step 1: Get Deployment URL**
After deploying, you'll get a URL like:
- `https://hire-collection-zunaid-reza.vercel.app` (Option 1)
- `https://hire-collection-zunaid-git-reza-yourname.vercel.app` (Option 2)

**Step 2: Add to Supabase**
1. Go to: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx
2. Navigate to: **Authentication** → **URL Configuration**
3. Add to **Redirect URLs**:
   ```
   https://hire-collection-zunaid-reza.vercel.app/**
   ```
   (or your actual Reza deployment URL)
4. Click **Save**

---

## 🧪 TESTING REZA BRANCH

### Test Locally First:
```bash
# You're already on Reza branch
git branch
# Should show: * Reza

# Local server is running on http://localhost:3000
# Test all functionality locally first
```

### Test on Vercel:
1. Open Reza deployment URL
2. Clear browser cache (Ctrl + Shift + Delete)
3. Login with your credentials
4. Upload test data files
5. **Verify**: Current Overdue total = **18,506,924 BDT** ✅
6. **Check**: All features work correctly
7. **Test**: Filtering, export, admin functions

---

## ✅ APPROVAL PROCESS

### When Everything Works on Reza Branch:

**Step 1: Verify All Tests Pass**
- [ ] Login works
- [ ] File upload works
- [ ] Current Overdue total is correct (18,506,924 BDT)
- [ ] Filtering works
- [ ] Export works
- [ ] Admin functions work
- [ ] No console errors

**Step 2: Notify for Merge**
Tell the developer: **"All tests passed on Reza branch, ready to merge to main"**

**Step 3: Merge to Main**
The developer will run:
```bash
git checkout main
git merge Reza
git push origin main
```

**Step 4: Deploy Main to Production**
After merge, the main production site will auto-deploy with all changes.

---

## 🔄 WORKING ON REZA BRANCH

### Making Changes:
```bash
# Ensure you're on Reza branch
git checkout Reza

# Make your changes to files
# ...

# Commit changes
git add .
git commit -m "Description of changes"

# Push to Reza branch
git push origin Reza

# Vercel will auto-deploy the Reza branch
```

### Switching Between Branches:
```bash
# Switch to main (production)
git checkout main

# Switch back to Reza (development)
git checkout Reza

# View current branch
git branch
```

---

## 📊 BRANCH COMPARISON

| Aspect | Main Branch | Reza Branch |
|--------|-------------|-------------|
| **Purpose** | Production | Development/Testing |
| **Deployment** | zunaid.rezaulkarim.shop | Separate Vercel URL |
| **Status** | Stable | Testing new changes |
| **Users** | All users | Testing only |
| **Changes** | Approved only | Can experiment |

---

## 🎯 CURRENT STATE

### Main Branch:
- ✅ Has all bug fixes (commit b205f9d)
- ✅ Overdue matching logic fixed
- ✅ Production ready
- ✅ Deployed to: zunaid.rezaulkarim.shop

### Reza Branch:
- ✅ Based on main (includes all fixes)
- ✅ Added documentation files
- ✅ Ready for independent deployment
- ✅ Can be tested separately
- ⏳ Waiting for deployment to Vercel

---

## 🚨 IMPORTANT NOTES

### DO NOT:
- ❌ Don't merge Reza to main until approved
- ❌ Don't make changes directly to main branch
- ❌ Don't delete Reza branch until merged

### DO:
- ✅ Test all changes on Reza branch first
- ✅ Deploy Reza to separate Vercel project
- ✅ Verify everything works before merging
- ✅ Keep main branch stable

---

## 📞 MERGE APPROVAL WORKFLOW

```
1. Developer creates Reza branch ✅
   └─ Branch created and pushed

2. Deploy Reza to Vercel ⏳
   └─ You need to do this

3. Test on Reza deployment ⏳
   └─ Verify all functionality

4. Approve for merge ⏳
   └─ Tell developer: "Ready to merge"

5. Developer merges to main ⏳
   └─ git merge Reza

6. Production auto-deploys ⏳
   └─ Main site gets updates
```

---

## 🎉 BENEFITS OF THIS APPROACH

### Safety:
- ✅ Test changes without affecting production
- ✅ Can rollback easily if issues found
- ✅ Main branch stays stable

### Flexibility:
- ✅ Experiment with new features
- ✅ Multiple people can test
- ✅ Easy to compare versions

### Control:
- ✅ Merge only when approved
- ✅ Clear separation of environments
- ✅ Better change management

---

## 📁 NEXT STEPS

1. **Deploy Reza branch to Vercel** (see Option 1 or 2 above)
2. **Add Reza URL to Supabase** authorized domains
3. **Test thoroughly** on Reza deployment
4. **Approve for merge** when everything works
5. **Developer will merge** to main branch

---

**© All Rights Reserved By Zunaid Nomani**

**Branch**: Reza  
**Created**: May 9, 2026  
**Status**: ✅ Ready for deployment  
**Merge Status**: ⏳ Waiting for approval
