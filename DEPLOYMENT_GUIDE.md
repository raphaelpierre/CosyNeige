# Deployment Guide

## Production Environment Setup

### VPS Information
- **Server**: Debian 12
- **IP**: 51.83.99.118
- **Domain**: chalet-balmotte810.com
- **User**: debian
- **Project Path**: `/var/www/chalet-balmotte810`

### Environment Variables

The production `.env` file should be located at `/var/www/chalet-balmotte810/.env`

**Important**: Never commit `.env` files to git. Use `.env.example` as a template.

To restore production environment variables, copy from `.env.production` backup:
```bash
# On your local machine
scp .env.production debian@51.83.99.118:/var/www/chalet-balmotte810/.env
```

Or manually create the file on VPS with these required variables:

```bash
# Database - Local PostgreSQL
DATABASE_URL="postgresql://chalet_user:chalet_password_2024@localhost:5432/chalet_balmotte810"

# Authentication Secrets
JWT_SECRET="chalet_jwt_secret_production_2024_balmotte810_secure_key"
NEXTAUTH_SECRET="chalet_nextauth_secret_production_2024"

# Email Configuration
ADMIN_EMAIL="contact@chalet-balmotte810.com"
SMTP_HOST="localhost"
SMTP_PORT="25"
SMTP_FROM="noreply@chalet-balmotte810.com"

# App Configuration
NEXT_PUBLIC_BASE_URL="https://chalet-balmotte810.com"
NEXTAUTH_URL="https://chalet-balmotte810.com"
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="9b56TCiLf9QzKVGDSy6lPDkR9h0NUG_a47yPmlE5UwQ"

# Stripe Live Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
```

### Database Setup

PostgreSQL is installed locally on the VPS.

**Connection Details**:
- Host: localhost
- Port: 5432
- Database: chalet_balmotte810
- User: chalet_user
- Password: chalet_password_2024

**Reset Password** (if needed):
```bash
ssh debian@51.83.99.118
sudo -u postgres psql
ALTER USER chalet_user WITH PASSWORD 'chalet_password_2024';
\q
```

**Push Schema Changes**:
```bash
cd /var/www/chalet-balmotte810
npx prisma db push
npx prisma generate
```

### Email Configuration

**Postfix SMTP Server**:
- Host: localhost
- Port: 25 (no authentication required from localhost)
- TLS: Not required for localhost connections

**Important**: Always use `SMTP_HOST="localhost"` and `SMTP_PORT="25"` in production.

Using the external IP (51.83.99.118) will cause "Relay access denied" errors.

**Incoming Email Webhook**:
- Script: `/usr/local/bin/email-to-webhook.sh`
- Forwards emails to: `http://localhost:3000/api/webhooks/inbound-email`
- Log: `/var/log/email-webhook.log`

**Virtual Aliases** (in `/etc/postfix/virtual`):
```
info@chalet-balmotte810.com    "|/usr/local/bin/email-to-webhook.sh"
contact@chalet-balmotte810.com "|/usr/local/bin/email-to-webhook.sh"
admin@chalet-balmotte810.com   "|/usr/local/bin/email-to-webhook.sh"
```

### Deployment Steps

#### 1. Deploy Code (via rsync)

```bash
# From local machine
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  /Users/raphaelpierre/Development/chalet-balmotte810.com/ \
  debian@51.83.99.118:/var/www/chalet-balmotte810/
```

#### 2. Install Dependencies & Build

```bash
ssh debian@51.83.99.118
cd /var/www/chalet-balmotte810

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build application
npm run build
```

#### 3. Restart Application

```bash
# Restart PM2
pm2 restart chalet-balmotte810 --update-env

# Check status
pm2 status
pm2 logs chalet-balmotte810 --lines 50
```

#### 4. Verify Deployment

```bash
# Check HTTP response
curl -I https://chalet-balmotte810.com

# Check application logs
pm2 logs chalet-balmotte810
```

### Common Issues & Fixes

#### Issue: "Relay access denied" when sending emails

**Cause**: SMTP_HOST is set to external IP instead of localhost

**Fix**:
```bash
# Update .env
SMTP_HOST="localhost"
SMTP_PORT="25"

# Restart application
pm2 restart chalet-balmotte810 --update-env
```

#### Issue: Database schema out of sync

**Cause**: Prisma schema changes not applied to database

**Fix**:
```bash
cd /var/www/chalet-balmotte810
npx prisma db push --accept-data-loss
npx prisma generate
npm run build
pm2 restart chalet-balmotte810
```

#### Issue: Authentication errors (JWT)

**Cause**: Missing JWT_SECRET or NEXTAUTH_SECRET

**Fix**: Ensure these are set in `/var/www/chalet-balmotte810/.env`

#### Issue: Stripe not working

**Cause**: Missing or incorrect Stripe keys

**Fix**: Verify live keys in `.env`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
```

### PM2 Configuration

The application runs with PM2 process manager.

**Useful Commands**:
```bash
# Status
pm2 status

# Logs
pm2 logs chalet-balmotte810

# Restart
pm2 restart chalet-balmotte810 --update-env

# Stop
pm2 stop chalet-balmotte810

# Start
pm2 start chalet-balmotte810

# Monitor
pm2 monit
```

### Backup & Restore

#### Backup Database

```bash
ssh debian@51.83.99.118
pg_dump -U chalet_user chalet_balmotte810 > backup-$(date +%Y%m%d).sql
```

#### Backup .env

```bash
# Copy .env from VPS to local backup
scp debian@51.83.99.118:/var/www/chalet-balmotte810/.env .env.production.backup
```

#### Restore .env

```bash
# Copy .env.production to VPS
scp .env.production debian@51.83.99.118:/var/www/chalet-balmotte810/.env
```

### Security Checklist

- [ ] `.env` file is NOT committed to git
- [ ] `.env.production` backup exists locally
- [ ] PostgreSQL password is strong
- [ ] JWT secrets are unique and secure
- [ ] Stripe keys are LIVE mode (pk_live_... / sk_live_...)
- [ ] SMTP uses localhost (not external IP)
- [ ] HTTPS is enforced
- [ ] PM2 runs with minimal privileges

### Monitoring

**Application Health**:
```bash
curl -I https://chalet-balmotte810.com
```

**Email Logs**:
```bash
tail -f /var/log/email-webhook.log
```

**Application Logs**:
```bash
pm2 logs chalet-balmotte810
```

**Postfix Logs**:
```bash
journalctl -u postfix -f
```

**Database Status**:
```bash
sudo systemctl status postgresql
```

### Support

For issues or questions:
- Email: contact@chalet-balmotte810.com
- Check logs: `pm2 logs chalet-balmotte810`
- Review this guide and README.md
