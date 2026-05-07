# Production Deployment Guide

**© All Rights Reserved By Zunaid Nomani**

## Pre-Deployment Checklist

### ✅ Code Preparation

- [x] Credits added to all files
- [x] config.js added to .gitignore
- [x] config.example.js created
- [x] README.md updated with credits
- [x] Footer added with copyright notice
- [x] All documentation files created

### ✅ Security Checks

- [x] Supabase credentials in config.js (not committed)
- [x] RLS policies enabled on all tables
- [x] Email confirmation disabled (optional)
- [x] Super admin configured
- [x] Area admins configured

### ✅ Database Setup

- [x] superadmin_users table created
- [x] admin_users table created
- [x] user_profiles table created
- [x] uploads table created
- [x] hire_collection_data table created
- [x] get_available_plazas() function created
- [x] get_available_areas() function created

### ✅ User Configuration

- [x] Super admin: rezaul990drive@gmail.com
- [x] Area admin: tangail@rcm.com (Tangail Area)
- [x] Area admin: ctgwest@rcm.com (CTG West Area)

---

## GitHub Deployment Steps

### Step 1: Initialize Git Repository

```bash
# Navigate to project directory
cd /path/to/hire-collection-zunaid

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Hire Collection Dashboard v3.0.0

- Three-tier admin system (Super Admin, Area Admins, Regular Users)
- Multi-area support with data isolation
- Supabase integration for cloud database
- Excel file upload and processing
- Advanced filtering and analytics
- Area-specific data replacement
- Row Level Security (RLS) policies

© All Rights Reserved By Zunaid Nomani"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `hire-collection-zunaid`
3. Description: "Hire Collection Dashboard - Invoice-wise Overdue Analysis with Multi-Area Support"
4. Visibility: **Private** (recommended for production)
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### Step 3: Connect and Push to GitHub

```bash
# Set main branch
git branch -M main

# Add remote origin
git remote add origin https://github.com/rezaul990/hire-collection-zunaid.git

# Push to GitHub
git push -u origin main
```

### Step 4: Verify Deployment

1. Go to https://github.com/rezaul990/hire-collection-zunaid
2. Verify all files are present
3. Check that config.js is NOT in the repository (should be ignored)
4. Verify README.md displays correctly

---

## Post-Deployment Configuration

### For New Deployments

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rezaul990/hire-collection-zunaid.git
   cd hire-collection-zunaid
   ```

2. **Create config.js**:
   ```bash
   cp config.example.js config.js
   ```

3. **Edit config.js** with your Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'https://npakqmqmysiacdwjqdnx.supabase.co';
   const SUPABASE_ANON_KEY = 'your-actual-anon-key';
   ```

4. **Open in browser**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or just open index.html in browser
   ```

---

## Hosting Options

### Option 1: Netlify (Recommended)

1. **Connect GitHub repository**:
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Choose GitHub
   - Select `hire-collection-zunaid` repository

2. **Configure build settings**:
   - Build command: (leave empty)
   - Publish directory: `.` (root)

3. **Add environment variables**:
   - Go to Site settings → Environment variables
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Update config.js to use environment variables if needed

4. **Deploy**:
   - Click "Deploy site"
   - Get your URL: `https://hire-collection-zunaid.netlify.app`

### Option 2: Vercel

1. **Import project**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import from GitHub
   - Select `hire-collection-zunaid`

2. **Configure**:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

3. **Add environment variables**:
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

4. **Deploy**:
   - Click "Deploy"
   - Get your URL: `https://hire-collection-zunaid.vercel.app`

### Option 3: GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository settings
   - Navigate to "Pages"
   - Source: Deploy from branch
   - Branch: `main`, folder: `/ (root)`
   - Click "Save"

2. **Access**:
   - URL: `https://rezaul990.github.io/hire-collection-zunaid/`

**Note**: You'll need to manually add config.js to the repository for GitHub Pages (not recommended for security).

---

## Security Best Practices

### ✅ Do's

- ✅ Keep config.js in .gitignore
- ✅ Use environment variables for sensitive data
- ✅ Enable RLS policies on all Supabase tables
- ✅ Use HTTPS for all deployments
- ✅ Regularly update dependencies
- ✅ Monitor Supabase logs for suspicious activity
- ✅ Use strong passwords for all admin accounts
- ✅ Backup database regularly

### ❌ Don'ts

- ❌ Never commit config.js with real credentials
- ❌ Don't share Supabase anon key publicly
- ❌ Don't disable RLS policies
- ❌ Don't use weak passwords
- ❌ Don't expose admin emails publicly
- ❌ Don't skip email verification in production

---

## Maintenance

### Regular Tasks

**Weekly**:
- Monitor Supabase dashboard for usage
- Check for any errors in browser console
- Verify all area admins can upload

**Monthly**:
- Review database size and optimize if needed
- Check for Supabase updates
- Backup database
- Review user access logs

**Quarterly**:
- Update dependencies (Supabase client, SheetJS)
- Review and update documentation
- Test disaster recovery procedures
- Security audit

---

## Backup Strategy

### Database Backup

**Via Supabase Dashboard**:
1. Go to Supabase Dashboard
2. Navigate to Database → Backups
3. Click "Create backup"
4. Download backup file

**Via SQL**:
```sql
-- Export all data
COPY (SELECT * FROM hire_collection_data) TO '/tmp/data_backup.csv' CSV HEADER;
COPY (SELECT * FROM uploads) TO '/tmp/uploads_backup.csv' CSV HEADER;
```

### Code Backup

**Via Git**:
```bash
# Create a release tag
git tag -a v3.0.0 -m "Production release v3.0.0"
git push origin v3.0.0

# Create a backup branch
git checkout -b backup-2026-05-07
git push origin backup-2026-05-07
```

---

## Monitoring

### Key Metrics to Monitor

1. **Database Size**: Should stay under 500 MB (free tier)
2. **API Requests**: Monitor for unusual spikes
3. **User Activity**: Track logins and uploads
4. **Error Rates**: Check browser console and Supabase logs
5. **Upload Success Rate**: Monitor failed uploads

### Supabase Dashboard

- **Database**: Monitor size and performance
- **Authentication**: Track user signups and logins
- **API**: Monitor request rates
- **Logs**: Check for errors

---

## Troubleshooting

### Common Issues

**Issue**: config.js not found
- **Solution**: Copy config.example.js to config.js and add credentials

**Issue**: Supabase connection error
- **Solution**: Verify SUPABASE_URL and SUPABASE_ANON_KEY in config.js

**Issue**: Users can't sign up
- **Solution**: Check email confirmation settings in Supabase

**Issue**: Area admin can't upload
- **Solution**: Verify they're in admin_users table with correct area

**Issue**: Data not loading
- **Solution**: Check RLS policies and user permissions

---

## Version History

### v3.0.0 (Current)
- Three-tier admin system
- Multi-area support
- Area-specific data replacement
- Enhanced security with RLS
- Complete documentation

### v2.0.0
- Plaza-based user system
- Single area admin
- Data replacement feature

### v1.0.0
- Initial Supabase integration
- Basic authentication
- Excel upload functionality

---

## Support

For technical support or questions:
- Check documentation files in the repository
- Review Supabase documentation: https://supabase.com/docs
- Contact development team

---

## Credits

**Developer**: Zunaid Nomani  
**Project**: Hire Collection Dashboard  
**Version**: 3.0.0  
**Year**: 2026  

**© All Rights Reserved By Zunaid Nomani**

---

## Summary

✅ **Production Ready**: All security measures in place  
✅ **Documented**: Complete documentation provided  
✅ **Tested**: Three-tier system tested and verified  
✅ **Secure**: RLS policies and access control implemented  
✅ **Scalable**: Supports multiple areas and unlimited users  

**Ready to deploy!** 🚀
