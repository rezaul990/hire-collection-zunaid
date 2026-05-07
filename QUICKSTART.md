# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Open the Application
The application is now running in your browser at the file location.

**Or start a local server**:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server

# Then visit: http://localhost:8000
```

### Step 2: Create Your Account
1. You'll see the login screen
2. Click **"Sign Up"** link
3. Enter your email and password (min 6 characters)
4. Click **"Sign Up"** button
5. Check your email for verification (if required)
6. Click **"Sign In"** and enter your credentials

### Step 3: Upload Your First Data
1. Click **"Upload New Data"** button
2. Select your three Excel files:
   - **Target/Collection Excel** - Your main collection data
   - **Current Overdue Excel** - Current period overdue amounts
   - **Previous Overdue Excel** - Previous period overdue amounts
3. Click **"Upload & Save to Database"**
4. Wait for processing (usually 5-15 seconds)
5. Success! Your data is now in the cloud

### Step 4: Analyze Your Data
1. Your uploaded batch is automatically selected
2. View the 16 metric cards at the top
3. Use filters to narrow down data:
   - **Search box**: Find by name, account, invoice, etc.
   - **Dropdowns**: Filter by Division, Area, Plaza, Product, Person
   - **Date filters**: Year, Month, Day range
   - **Checkboxes**: Overdue only, Below target, etc.
4. Click metric cards for quick filtering
5. Scroll through the data table

### Step 5: Export Results
1. Apply any filters you want
2. Click **"Filtered Data (.xlsx)"** to export filtered results
3. Or click **"All Data (.xlsx)"** to export everything
4. Open the downloaded Excel file

## 📊 Excel File Format

### Your Excel files should have these columns:

**Target/Collection Excel**:
- S/N, Division, Area, Plaza
- Account No., Customer Name, Mobile No.
- Product Category, Assign Person ID
- Invoice No., Invoice Date, Matured Date
- Per Month Ins. Schedule Amt.
- Collection Target, Collection Achieve

**Overdue Excel files**:
- Division, Area, Plaza
- Account No., Customer Name, Mobile No.
- Sale Invoice (or Invoice No.)
- Product Category, Assign Person ID
- Overdue

> **Note**: Column names are flexible - the app recognizes variations like "Iteem Category" vs "Item Category"

## 🎯 Common Tasks

### View Previous Uploads
1. Click the **batch dropdown** at the top
2. Select any previous upload
3. Data loads instantly from the database

### Filter by Overdue Accounts
1. Check the **"Overdue Only"** checkbox
2. Or click the **"Overdue A/C Qty."** card

### Find Specific Customer
1. Type customer name in the **Search box**
2. Results filter instantly

### Export Monthly Report
1. Select **Month** from dropdown
2. Apply any other filters
3. Click **"Filtered Data (.xlsx)"**

### Sign Out
1. Click **"Sign Out"** button in the top right
2. Your data remains safe in the database

## 🔧 Troubleshooting

### Can't sign in?
- Check your email and password
- Look for verification email
- Try password reset (if implemented)

### Upload fails?
- Check Excel file format
- Ensure all required columns exist
- Try with smaller file first
- Check browser console for errors

### Data not showing?
- Refresh the page
- Check if correct batch is selected
- Verify internet connection
- Check Supabase project status

### Filters not working?
- Clear all filters and try again
- Refresh the page
- Check if data is loaded

## 💡 Pro Tips

1. **Batch Naming**: Upload files with descriptive names like "Collection_Jan2024.xlsx"
2. **Regular Uploads**: Upload data weekly or monthly to track trends
3. **Use Filters**: Combine multiple filters for detailed analysis
4. **Export Often**: Download filtered results for presentations
5. **Check Metrics**: Monitor the 16 metric cards for quick insights

## 📱 Mobile Access

The dashboard works on mobile devices:
- Responsive design adapts to screen size
- All features available
- Touch-friendly interface
- Swipe to scroll tables

## 🔐 Security Tips

1. **Use strong passwords** (8+ characters, mix of letters/numbers)
2. **Don't share credentials** - each user should have their own account
3. **Sign out** when using shared computers
4. **Regular backups** - export your data periodically

## 🆘 Need Help?

1. **Check README.md** for detailed documentation
2. **Review PROJECT_SUMMARY.md** for technical details
3. **See DEPLOYMENT.md** for hosting instructions
4. **Browser Console** - Press F12 to see error messages

## 🎉 You're Ready!

Your dashboard is now:
- ✅ Connected to cloud database
- ✅ Secure with user authentication
- ✅ Ready for multiple users
- ✅ Storing data permanently
- ✅ Accessible from anywhere

**Start uploading and analyzing your hire collection data!**

---

## Next Steps

1. **Share with team**: Send them the URL and this guide
2. **Upload historical data**: Import past months for trend analysis
3. **Set up regular uploads**: Schedule weekly/monthly data uploads
4. **Deploy to production**: See DEPLOYMENT.md for hosting options
5. **Customize**: Modify colors, add features, or adjust filters

**Happy analyzing! 📊**
