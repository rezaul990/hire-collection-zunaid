# Hire Collection Dashboard - Supabase Edition

**© All Rights Reserved By Zunaid Nomani**

A dynamic, cloud-powered web application for analyzing hire purchase collection data with three-tier admin system and multi-area support.

---

## 🎯 Features

### 🔐 Three-Tier User System
- **Super Admin** (rezaul990drive@gmail.com): Full access to all areas, manages area admins
- **Area Admins**: Upload and view data for their specific area only
- **Regular Users**: View data for their assigned plaza only
- Secure authentication with role-based access control

### 📊 Data Management
- Upload Excel files (Target, Current Overdue, Previous Overdue)
- Automatic data parsing and merging
- Store data in Supabase PostgreSQL database
- Area-based data isolation
- Data replacement on upload (super admin: all data, area admin: their area only)

### 📈 Analytics Dashboard
- 16 key performance metrics with visual cards
- Real-time filtering and search
- Interactive data table with color-coded rows
- Export filtered or all data to Excel

### 🔍 Advanced Filtering
- Text search across multiple fields
- Filter by Division, Area, Plaza, Product, Person ID
- Date range filters (Year, Month, Day range)
- Quick filters: Overdue Only, Below Target, Below Overdue
- Clickable metric cards for instant filtering

## Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Supabase and CDN libraries)

### Supabase Project Details
- **Project Name**: Hire Collection Dashboard
- **Project ID**: npakqmqmysiacdwjqdnx
- **Region**: ap-southeast-1 (Singapore)
- **URL**: https://npakqmqmysiacdwjqdnx.supabase.co

### Database Schema
The application uses five main tables:

1. **superadmin_users** - Super admin accounts
   - Full system access and admin management
   
2. **admin_users** - Area admin accounts
   - Area-specific access and upload permissions
   
3. **user_profiles** - Regular user profiles
   - Plaza assignment for data filtering

4. **uploads** - Tracks Excel file uploads
   - Stores file metadata, upload date, and user information
   
5. **hire_collection_data** - Stores the merged collection data
   - Contains all invoice and collection details
   - Filtered by area/plaza based on user role

### Running the Application

1. **Open the application**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

2. **Initial Setup (First Time Only)**
   - See `QUICK_SETUP.md` for super admin setup
   - Or see `COMPLETE_SETUP_GUIDE.md` for detailed instructions
   - Super admin: rezaul990drive@gmail.com

3. **For Super Admin**
   - Sign in with rezaul990drive@gmail.com
   - Upload data for all areas
   - Add area admins via "Manage Admins" button
   - See all data from all areas

4. **For Area Admins**
   - Sign up with your email
   - Super admin adds you as area admin
   - Sign in to upload data for your area
   - See only your area's data

5. **For Regular Users**
   - Sign up and select your plaza
   - Sign in to view your plaza's data
   - Use filters and export features

## User Roles & Permissions

| Role | Upload Data | View Data | Manage Admins | Badge |
|------|-------------|-----------|---------------|-------|
| Super Admin | All areas | All areas | ✅ Yes | "(Super Admin)" |
| Area Admin | Their area | Their area | ❌ No | "({Area} Admin)" |
| Regular User | ❌ No | Their plaza | ❌ No | "({Plaza})" |

### Super Admin
- **Email**: rezaul990drive@gmail.com
- **Can do**: Upload data for all areas, manage area admins, see all data
- **Setup**: See `QUICK_SETUP.md` or `COMPLETE_SETUP_GUIDE.md`

### Area Admin
- **Can do**: Upload data for their area, see their area's data only
- **Setup**: Super admin adds them via "Manage Admins" panel

### Regular User
- **Can do**: View their plaza's data, use filters, export data
- **Setup**: Sign up and select plaza during registration

## Excel File Format

### Target/Collection Excel
Required columns:
- S/N, Division, Area, Plaza
- Account No., Customer Name, Mobile No.
- Product Category, Assign Person ID
- Invoice No., Invoice Date, Matured Date
- Per Month Ins. Schedule Amt.
- Collection Target, Collection Achieve

### Current/Previous Overdue Excel
Required columns:
- Division, Area, Plaza
- Account No., Customer Name, Mobile No.
- Sale Invoice / Invoice No.
- Product Category, Assign Person ID
- Overdue

## Features Comparison

| Feature | Original Version | Supabase Version |
|---------|-----------------|------------------|
| Data Storage | Browser only | Cloud database |
| Multi-user | No | Yes (with auth) |
| Data Persistence | Session only | Permanent |
| Historical Data | No | Yes (all uploads saved) |
| Collaboration | No | Yes (shared database) |
| Offline Access | Yes | No (requires internet) |

## Security Features

- **Three-tier access control**: Super Admin → Area Admins → Regular Users
- **Row Level Security (RLS)**: Database-level access control
- **Area-based filtering**: Area admins see only their area
- **Plaza-based filtering**: Regular users see only their plaza
- **Secure authentication**: Supabase Auth with email/password
- **Cannot be bypassed**: Security enforced at database level

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Excel Processing**: SheetJS (xlsx.js)
- **Hosting**: Can be deployed to any static host (Netlify, Vercel, GitHub Pages)

## Deployment Options

### Option 1: GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via: `https://yourusername.github.io/repo-name`

### Option 2: Netlify
1. Drag and drop the folder to Netlify
2. Instant deployment with HTTPS
3. Custom domain support

### Option 3: Vercel
1. Import GitHub repository
2. Automatic deployments on push
3. Edge network for fast loading

## Free Tier Limits (Supabase)

- **Database**: 500 MB storage
- **Bandwidth**: 5 GB per month
- **API Requests**: Unlimited
- **Authentication**: 50,000 monthly active users
- **File Storage**: 1 GB

Perfect for small to medium teams!

## Documentation

- **QUICK_SETUP.md** - Fast 5-minute setup guide
- **COMPLETE_SETUP_GUIDE.md** - Detailed step-by-step instructions
- **THREE_TIER_SYSTEM.md** - Complete system documentation
- **SETUP_SUPERADMIN.sql** - SQL commands for super admin setup
- **DEPLOYMENT.md** - Deployment instructions
- **PROJECT_SUMMARY.md** - Technical overview

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify Supabase project is active
3. Ensure internet connection is stable
4. Check Excel file format matches requirements

## Future Enhancements

- [ ] Data visualization charts
- [ ] Automated email reports
- [ ] Mobile app version
- [ ] Bulk data import/export
- [ ] Advanced analytics and trends
- [ ] Team collaboration features
- [ ] Custom report templates

## License

**© All Rights Reserved By Zunaid Nomani**

This project is proprietary software. All rights reserved.

---

## Credits

**Developer**: Zunaid Nomani  
**Project**: Hire Collection Dashboard  
**Version**: 3.0.0  
**Technology Stack**: HTML5, CSS3, JavaScript, Supabase (PostgreSQL)  
**Year**: 2026

---

## Contact

For support or inquiries, please contact the development team.

---

**Built with ❤️ by Zunaid Nomani**
