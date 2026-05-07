# Deployment Guide

## Quick Deploy to Netlify (Recommended)

1. **Create a Netlify account** at https://netlify.com

2. **Deploy via Drag & Drop**:
   - Go to https://app.netlify.com/drop
   - Drag the entire project folder
   - Your site will be live in seconds!

3. **Or deploy via CLI**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

## Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** and your site will be live!

## Deploy to GitHub Pages

1. **Create a GitHub repository**

2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/hire-collection-dashboard.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to Pages section
   - Select "main" branch as source
   - Click Save

4. **Access your site** at:
   `https://yourusername.github.io/hire-collection-dashboard`

## Custom Domain Setup

### For Netlify:
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Update DNS records as instructed

### For Vercel:
1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS records

### For GitHub Pages:
1. Add a `CNAME` file with your domain
2. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

## Environment Variables

If you want to hide the Supabase keys (optional for production):

1. **Create environment variables** in your hosting platform:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

2. **Update config.js** to use environment variables (requires build step)

3. **Or use a serverless function** to proxy requests

## SSL/HTTPS

All recommended platforms provide free SSL certificates automatically:
- ✅ Netlify: Automatic
- ✅ Vercel: Automatic
- ✅ GitHub Pages: Automatic

## Performance Optimization

### Enable Caching
Add `netlify.toml` or `vercel.json`:

**netlify.toml**:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

**vercel.json**:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000"
        }
      ]
    }
  ]
}
```

### CDN Benefits
All platforms use global CDN:
- Faster loading worldwide
- Automatic edge caching
- DDoS protection

## Monitoring

### Netlify Analytics
- Enable in Site Settings
- $9/month for detailed analytics

### Vercel Analytics
- Enable in Project Settings
- Free tier available

### Google Analytics
Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Backup Strategy

### Database Backups (Supabase)
- Free tier: Daily backups (7 days retention)
- Pro tier: Point-in-time recovery

### Manual Backup
```bash
# Export all data
supabase db dump -f backup.sql
```

## Troubleshooting Deployment

### Issue: Site not loading
- Check browser console for errors
- Verify Supabase project is active
- Check network tab for failed requests

### Issue: Authentication not working
- Verify Supabase URL and keys are correct
- Check if email confirmation is required
- Ensure cookies are enabled

### Issue: Slow loading
- Enable CDN caching
- Optimize images (if any added)
- Use production build of libraries

## Cost Estimate

### Free Tier (Recommended for start)
- **Hosting**: $0 (Netlify/Vercel/GitHub Pages)
- **Database**: $0 (Supabase free tier)
- **Total**: $0/month

### Paid Tier (For growth)
- **Hosting**: $0-20/month
- **Database**: $25/month (Supabase Pro)
- **Total**: $25-45/month

## Security Checklist

- [x] RLS enabled on all tables
- [x] HTTPS enabled
- [x] API keys are public-safe
- [x] User authentication required
- [x] Input validation on uploads
- [ ] Rate limiting (optional)
- [ ] CORS configuration (if needed)

## Post-Deployment

1. **Test all features**:
   - Sign up / Sign in
   - Upload Excel files
   - Filter and search
   - Export data

2. **Share with team**:
   - Send deployment URL
   - Provide login instructions
   - Share Excel format requirements

3. **Monitor usage**:
   - Check Supabase dashboard
   - Monitor database size
   - Track active users

## Support

For deployment issues:
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs
- GitHub Pages: https://docs.github.com/pages
- Supabase: https://supabase.com/docs
