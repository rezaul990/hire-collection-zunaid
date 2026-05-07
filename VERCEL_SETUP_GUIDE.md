# Vercel Deployment Setup Guide

## Problem
Your Vercel deployment is failing because `config.js` is not in the repository (it's in `.gitignore` for security).

## Solution
Use environment variables in Vercel to generate `config.js` during build time.

---

## Step-by-Step Setup

### 1. Add Environment Variables to Vercel

1. Go to your Vercel project: https://vercel.com/rezaul990/hire-collection-zunaid
2. Click on **Settings**
3. Click on **Environment Variables** in the left sidebar
4. Add these two variables:

**Variable 1:**
- **Name**: `SUPABASE_URL`
- **Value**: `https://npakqmqmysiacdwjqdnx.supabase.co`
- **Environment**: Production, Preview, Development (select all)

**Variable 2:**
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon key (get from Supabase dashboard)
- **Environment**: Production, Preview, Development (select all)

### 2. Get Your Supabase Anon Key

1. Go to: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx/settings/api
2. Copy the **anon public** key
3. Paste it as the value for `SUPABASE_ANON_KEY` in Vercel

### 3. Push New Files to GitHub

The following files have been created:
- ✅ `create-config.js` - Script to generate config.js from env vars
- ✅ `vercel.json` - Vercel build configuration

Commit and push these files:

```bash
git add create-config.js vercel.json VERCEL_SETUP_GUIDE.md
git commit -m "Add Vercel deployment configuration

- Add create-config.js to generate config from env vars
- Add vercel.json for build configuration
- Fixes config.js 404 error on Vercel"
git push origin main
```

### 4. Redeploy on Vercel

After pushing, Vercel will automatically redeploy. Or manually trigger:
1. Go to your Vercel dashboard
2. Click **Deployments**
3. Click **Redeploy** on the latest deployment

---

## How It Works

### Build Process
1. Vercel reads environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
2. Runs `node create-config.js` (defined in `vercel.json`)
3. Script creates `config.js` with the values
4. Deployment includes the generated `config.js`

### Security
- ✅ `config.js` never committed to Git
- ✅ Credentials stored securely in Vercel
- ✅ Different values for different environments (if needed)

---

## Verification

After deployment, check:

1. **Visit your site**: https://hire-collection-zunaid.vercel.app
2. **Open browser console** (F12)
3. **Should NOT see**: "config.js 404" error
4. **Should NOT see**: "SUPABASE_URL is not defined" error
5. **Should see**: Login page loads correctly

---

## Alternative: Use Inline Configuration

If you prefer not to use a separate config file, you can modify `app.js` to read from inline variables:

### Option A: Inline in index.html

Add this before loading `app.js`:

```html
<script>
  // Supabase Configuration (set via Vercel env vars during build)
  const SUPABASE_URL = 'https://npakqmqmysiacdwjqdnx.supabase.co';
  const SUPABASE_ANON_KEY = 'your-anon-key-here';
</script>
<script src="app.js"></script>
```

### Option B: Environment Variable Replacement

Use Vercel's build-time replacement (requires build step).

---

## Troubleshooting

### "config.js 404" still appears
- Check environment variables are set in Vercel
- Check `vercel.json` is in repository
- Check `create-config.js` is in repository
- Redeploy after adding env vars

### "SUPABASE_URL is not defined"
- Environment variables not set correctly
- Build script didn't run
- Check Vercel build logs

### Build fails
- Check `create-config.js` syntax
- Check environment variables are set
- Check Vercel build logs for errors

---

## Current Files

### create-config.js
```javascript
const fs = require('fs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('ERROR: Missing required environment variables!');
  process.exit(1);
}

const configContent = `const SUPABASE_URL = '${SUPABASE_URL}';
const SUPABASE_ANON_KEY = '${SUPABASE_ANON_KEY}';`;

fs.writeFileSync('config.js', configContent);
console.log('✅ config.js created successfully');
```

### vercel.json
```json
{
  "buildCommand": "node create-config.js",
  "outputDirectory": ".",
  "installCommand": "echo 'No dependencies to install'",
  "framework": null
}
```

---

## Quick Checklist

- [ ] Add `SUPABASE_URL` to Vercel environment variables
- [ ] Add `SUPABASE_ANON_KEY` to Vercel environment variables
- [ ] Commit `create-config.js` to Git
- [ ] Commit `vercel.json` to Git
- [ ] Push to GitHub
- [ ] Wait for Vercel to redeploy
- [ ] Test the deployment
- [ ] Verify no console errors

---

## Next Steps

After fixing the deployment:

1. ✅ Configure authorized domains in Supabase (see `CONFIGURE_DOMAINS.md`)
2. ✅ Test authentication on Vercel deployment
3. ✅ Test authentication on custom domain
4. ✅ Monitor for any errors

---

**© All Rights Reserved By Zunaid Nomani**

**Project**: Hire Collection Dashboard v3.0.0
**Deployment**: Vercel + Custom Domain
**Status**: Ready for production ✅
