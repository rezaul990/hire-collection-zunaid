#!/bin/bash

# Hire Collection Dashboard - GitHub Deployment Script
# © All Rights Reserved By Zunaid Nomani

echo "========================================="
echo "Hire Collection Dashboard"
echo "GitHub Deployment Script"
echo "© All Rights Reserved By Zunaid Nomani"
echo "========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed"
    echo "Please install Git first: https://git-scm.com/downloads"
    exit 1
fi

# Check if config.js exists
if [ ! -f "config.js" ]; then
    echo "⚠️  Warning: config.js not found"
    echo "This is normal - config.js should not be committed to Git"
    echo "Make sure to create config.js from config.example.js after cloning"
fi

echo "📋 Step 1: Initializing Git repository..."
git init

echo ""
echo "📋 Step 2: Adding all files..."
git add .

echo ""
echo "📋 Step 3: Creating initial commit..."
git commit -m "Initial commit: Hire Collection Dashboard v3.0.0

- Three-tier admin system (Super Admin, Area Admins, Regular Users)
- Multi-area support with data isolation
- Supabase integration for cloud database
- Excel file upload and processing
- Advanced filtering and analytics
- Area-specific data replacement
- Row Level Security (RLS) policies

© All Rights Reserved By Zunaid Nomani"

echo ""
echo "📋 Step 4: Setting main branch..."
git branch -M main

echo ""
echo "📋 Step 5: Adding remote origin..."
git remote add origin https://github.com/rezaul990/hire-collection-zunaid.git

echo ""
echo "📋 Step 6: Pushing to GitHub..."
git push -u origin main

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "Your repository is now available at:"
echo "https://github.com/rezaul990/hire-collection-zunaid"
echo ""
echo "Next steps:"
echo "1. Go to GitHub and verify the repository"
echo "2. Set repository to Private (recommended)"
echo "3. Add collaborators if needed"
echo "4. Deploy to Netlify/Vercel (see PRODUCTION_DEPLOYMENT.md)"
echo ""
echo "© All Rights Reserved By Zunaid Nomani"
echo "========================================="
