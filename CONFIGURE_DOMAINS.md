# Configure Authorized Domains for Supabase Authentication

## Your Domains
- **Vercel Domain**: `hire-collection-zunaid.vercel.app`
- **Custom Domain**: `zunaid.rezaulkarim.shop`

## Steps to Configure

### 1. Access Supabase Dashboard

Go to your Supabase project dashboard:
- URL: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx

### 2. Navigate to URL Configuration

1. Click on **Authentication** in the left sidebar
2. Click on **URL Configuration**
3. Or go directly to: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx/auth/url-configuration

### 3. Update Site URL

Set your **Site URL** to your production domain:
```
https://zunaid.rezaulkarim.shop
```

This is the default redirect URL when no `redirectTo` is specified.

### 4. Add Redirect URLs

In the **Redirect URLs** section, add these URLs (one per line):

```
https://hire-collection-zunaid.vercel.app/**
https://zunaid.rezaulkarim.shop/**
http://localhost:3000/**
```

**Explanation:**
- `https://hire-collection-zunaid.vercel.app/**` - Your Vercel deployment
- `https://zunaid.rezaulkarim.shop/**` - Your custom domain
- `http://localhost:3000/**` - For local development
- The `**` wildcard matches all paths under each domain

### 5. Save Changes

Click **Save** to apply the configuration.

---

## What This Does

### Site URL
- Default redirect after authentication
- Used in email templates
- Should be your primary production domain

### Redirect URLs (Allow List)
- Controls where users can be redirected after authentication
- Prevents open redirect vulnerabilities
- Supports wildcards for flexibility

---

## Testing After Configuration

### Test Sign In
1. Go to `https://zunaid.rezaulkarim.shop`
2. Try signing in with your credentials
3. Should redirect back to your app after authentication

### Test Sign Up
1. New users should be able to sign up
2. Should redirect to your app after signup
3. Email confirmation (if enabled) should work

---

## Current Configuration Summary

**Project**: Hire Collection Dashboard
**Project ID**: npakqmqmysiacdwjqdnx
**Region**: ap-southeast-1 (Singapore)

**Configured Domains:**
- ✅ Vercel: `hire-collection-zunaid.vercel.app`
- ✅ Custom: `zunaid.rezaulkarim.shop`
- ✅ Local: `localhost:3000`

---

## Troubleshooting

### If authentication fails:

1. **Check browser console** for errors
2. **Verify domains** are exactly as configured (no typos)
3. **Check HTTPS** - all production URLs must use HTTPS
4. **Clear browser cache** and try again

### Common Issues:

**"Invalid redirect URL"**
- Domain not in allow list
- Typo in domain name
- Missing `https://` protocol

**"Site URL mismatch"**
- Update Site URL to match your primary domain
- Ensure email templates use correct domain

---

## Email Templates

If you're using email authentication, you may need to update email templates:

1. Go to **Authentication** > **Email Templates**
2. Replace `{{ .SiteURL }}` with `{{ .RedirectTo }}` if using custom redirects
3. Example:
   ```html
   <!-- Old -->
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
     Confirm your email
   </a>
   
   <!-- New -->
   <a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
     Confirm your email
   </a>
   ```

---

## Next Steps

After configuring domains:

1. ✅ **Test authentication** on both domains
2. ✅ **Update DNS** if custom domain not working
3. ✅ **Configure SSL** on custom domain
4. ✅ **Test email flows** (signup, password reset)
5. ✅ **Monitor logs** for any authentication errors

---

## Quick Reference

**Supabase Dashboard URLs:**
- Project: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx
- URL Config: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx/auth/url-configuration
- Email Templates: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx/auth/templates

**Your Application URLs:**
- Vercel: https://hire-collection-zunaid.vercel.app
- Custom: https://zunaid.rezaulkarim.shop
- GitHub: https://github.com/rezaul990/hire-collection-zunaid

---

**© All Rights Reserved By Zunaid Nomani**
