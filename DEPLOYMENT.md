# 🚀 Vercel Deployment Guide for Chalet-Balmotte810

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a PostgreSQL database (Neon, PlanetScale, or Supabase recommended)
3. **GitHub Repository**: Push your code to GitHub

## Step-by-Step Deployment

### 1. **Set up a PostgreSQL Database**

Choose one of these providers:
- **Neon** (Recommended): [neon.tech](https://neon.tech) - Free tier available
- **Supabase**: [supabase.com](https://supabase.com) - Free tier available
- **PlanetScale**: [planetscale.com](https://planetscale.com) - Free tier available

Get your connection string (starts with `postgresql://`)

### 2. **Deploy to Vercel**

#### Option A: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. **Environment Variables**

Set these in your Vercel dashboard (Project Settings → Environment Variables):

```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-super-secret-nextauth-key-32-chars-min
NEXTAUTH_URL=https://your-project.vercel.app
JWT_SECRET=your-super-secret-jwt-key-32-chars-min
```

**Important**: 
- Generate secure secrets using `openssl rand -base64 32`
- Replace `your-project.vercel.app` with your actual Vercel domain

### 4. **Database Migration**

After deployment, run the database migration:

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Pull environment variables
vercel env pull .env.production

# Run migration
npx prisma migrate deploy
```

Or use Vercel's serverless function approach by creating a migration endpoint.

## 🔧 Troubleshooting

### Build Issues
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check that Prisma generates correctly with `npx prisma generate`

### Database Issues
- Verify your DATABASE_URL is correct
- Ensure your database allows external connections
- Check firewall settings if using self-hosted database

### Environment Variables
- All environment variables must be set in Vercel dashboard
- NEXTAUTH_URL must match your deployed domain
- Secrets should be at least 32 characters long

## 🎯 Post-Deployment Checklist

- [ ] Database connected and migrated
- [ ] Authentication working
- [ ] Images loading from Unsplash
- [ ] API endpoints responding
- [ ] Admin panel accessible
- [ ] Booking system functional

## 🌍 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update NEXTAUTH_URL environment variable
4. Configure DNS as instructed by Vercel

## 📊 Monitoring

- Check Vercel Functions logs for API issues
- Monitor database connections
- Set up error tracking (Sentry recommended)

## 🔄 Updates

To deploy updates:
```bash
git push origin main
```

Vercel will automatically redeploy on pushes to main branch.