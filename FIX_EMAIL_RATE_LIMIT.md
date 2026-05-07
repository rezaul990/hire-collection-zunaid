# Fix: Email Rate Limit Exceeded

## Problem
You're seeing "email rate limit exceeded" when trying to sign up. This happens because:
1. Supabase is trying to send verification emails
2. Free tier has a limit on email sending
3. You've hit that limit

## Solution: Disable Email Confirmation

### Step 1: Go to Supabase Dashboard
Visit: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx

### Step 2: Navigate to Authentication Settings
1. Click **"Authentication"** in the left sidebar
2. Click **"Providers"**
3. Click **"Email"**

### Step 3: Disable Email Confirmation
1. Scroll down to find **"Confirm email"** toggle
2. **Turn it OFF** (disable it)
3. Click **"Save"** at the bottom

### Step 4: Test Again
1. Refresh your application
2. Try signing up again
3. Should work without email verification!

## Alternative: Wait and Retry
If you can't access the dashboard right now:
- Wait 1 hour (rate limit resets)
- Try signing up again
- But you'll hit the limit again unless you disable email confirmation

## Why This Happens
- Supabase free tier: 4 emails per hour
- Each signup attempt sends a verification email
- After 4 attempts, you hit the rate limit

## After Disabling Email Confirmation
✅ No verification emails sent
✅ No rate limits
✅ Users can sign up instantly
✅ Users are automatically logged in

## Verification Steps
After disabling email confirmation:
1. Go to your app
2. Click "Sign Up"
3. Enter email, password, select Plaza
4. Click "Sign Up"
5. Should see: "Account created successfully! Signing you in..."
6. Should be logged in immediately

## Security Note
For internal team use (your case), disabling email confirmation is fine because:
- You control who gets access
- You know your team members
- Faster onboarding
- No email delivery issues

For public applications, keep email confirmation enabled.

## Still Having Issues?

### Check if email confirmation is actually disabled:
```sql
-- Run this in Supabase SQL Editor
SELECT * FROM auth.config;
```

Look for `GOTRUE_MAILER_AUTOCONFIRM` - should be `true`

### Or use Supabase CLI:
```bash
supabase secrets set GOTRUE_MAILER_AUTOCONFIRM=true
```

## Summary
**The fix is simple**: Disable email confirmation in Supabase dashboard, and the error will go away! 🎉
