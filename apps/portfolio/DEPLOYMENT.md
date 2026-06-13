# 🚀 Deployment Guide

## GitHub Setup

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `my-portfolio`
   - Description: "Modern portfolio website showcasing Flutter mobile app development projects"
   - Make it Public or Private
   - Don't initialize with README (we already have one)

2. **Push to GitHub**
   ```bash
   cd /Users/bilal/Me/MyPortf/my-portfolio
   git init
   git add -A
   git commit -m "Initial commit: Complete portfolio with 7+ projects and Supabase blog"
   git branch -M main
   git remote add origin https://github.com/BilalFali/my-portfolio.git
   git push -u origin main
   ```

## Vercel Deployment

### Option 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `BilalFali/my-portfolio`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Environment Variables**
   Add these in Vercel dashboard:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://eughckiefhkiearcrbwt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here
   PAGE_ACCESS_PASSWORD=password
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add PAGE_ACCESS_PASSWORD

# Deploy to production
vercel --prod
```

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Post-Deployment Checklist

✅ All pages load correctly
✅ Blog posts display from Supabase
✅ Project screenshots appear
✅ Dark/Light mode works
✅ Mobile responsive
✅ Favicon shows letter "B"
✅ SEO meta tags present
✅ Environment variables configured

## Troubleshooting

**Build fails:**

- Check environment variables are set
- Run `npm run build` locally first
- Check build logs in Vercel dashboard

**Blog not loading:**

- Verify Supabase credentials
- Check NEXT*PUBLIC* prefix on env vars
- Ensure Supabase tables exist

**Images not showing:**

- Check file paths are correct
- Verify images exist in public folder
- Clear Vercel cache and redeploy

## Continuous Deployment

Every push to `main` branch will automatically deploy to Vercel!

```bash
# Make changes
git add .
git commit -m "Update project"
git push

# Vercel automatically deploys
```

## Monitoring

- View analytics: https://vercel.com/dashboard
- Check deployment logs
- Monitor performance metrics
- Set up custom alerts
