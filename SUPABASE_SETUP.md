# Supabase Configuration Steps

## Disable Email Confirmation

To allow users to sign up without email verification:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/npakqmqmysiacdwjqdnx

2. Navigate to **Authentication** → **Providers** → **Email**

3. Find the setting **"Confirm email"** and **DISABLE** it

4. Click **Save**

This allows users to sign up and immediately access the application without needing to verify their email.

## Alternative: Use Supabase CLI

You can also disable email confirmation using the CLI:

```bash
# Update auth config
supabase secrets set GOTRUE_MAILER_AUTOCONFIRM=true
```

## Current Configuration

- **Project**: Hire Collection Dashboard
- **Project ID**: npakqmqmysiacdwjqdnx
- **Region**: ap-southeast-1
- **Email Confirmation**: Should be DISABLED

## User Flow After This Change

1. User clicks "Sign Up"
2. User enters email, password, and selects Plaza
3. User clicks "Sign Up" button
4. Account is created immediately (no email verification needed)
5. User is automatically signed in
6. User can start using the application

## Security Note

Disabling email confirmation means:
- ✅ Faster onboarding
- ✅ No email delivery issues
- ⚠️ Users can sign up with any email (even fake ones)
- ⚠️ No email ownership verification

For internal team use, this is usually fine. For public applications, keep email confirmation enabled.
