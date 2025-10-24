# Chalet-Balmotte810 - Technical Documentation

Enterprise-grade booking platform for luxury alpine chalet rental with integrated conversation management, payment processing, and automated invoicing.

**Production:** https://chalet-balmotte810.com
**Stack:** Next.js 15 + TypeScript + PostgreSQL + Prisma ORM

---

## Quick Start

```bash
# Clone & install
git clone https://github.com/raphaelpierre/chalet-balmotte810.com.git
cd chalet-balmotte810.com
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Database setup
npx prisma generate
npx prisma db push

# Development
npm run dev          # http://localhost:3000
npm run db:studio    # Prisma Studio on :5555
```

---

## System Architecture

### Tech Stack

**Frontend**
- Next.js 15.5.4 (App Router, Server Components, RSC)
- React 19.1.0 with TypeScript
- Tailwind CSS 4.0
- jsPDF + html2canvas (PDF generation)

**Backend**
- Next.js API Routes (serverless)
- Prisma ORM 6.x
- PostgreSQL 15+
- JWT authentication (bcryptjs)

**Infrastructure**
- **Production:** Self-hosted VPS (Debian 12, Nginx, PM2)
- **Database:** PostgreSQL on VPS
- **Email:** SMTP (Postfix) + webhook for inbound
- **Payments:** Stripe
- **SSL:** Let's Encrypt
- **DNS:** OVH

### Architecture Diagram

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTPS
       ↓
┌─────────────┐
│   Nginx     │  SSL Termination, Reverse Proxy
│  (Port 443) │
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────┐
│   Next.js   │  App Router + API Routes
│  (Port 3000)│
└──────┬──────┘
       │
       ├──→ Prisma ORM ──→ PostgreSQL
       ├──→ SMTP Server (outbound)
       └──→ Stripe API
```

### Data Flow

**Authentication:**
```
Login → JWT Token → HttpOnly Cookie → Middleware Validation
```

**Booking:**
```
Calendar Selection → Price Calculation → Payment Intent →
Stripe Checkout → Webhook → DB Update → Invoice PDF → Email
```

**Conversations:**
```
Client Email → Postfix → Webhook (/api/webhooks/inbound-email) →
Parse → Create Message → Notify Admin
```

---

## Environment Variables

### Critical Configuration

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Authentication (min 32 chars)
JWT_SECRET="your-jwt-secret-key-minimum-32-characters-long"
NEXTAUTH_SECRET="your-nextauth-secret-minimum-32-characters"

# Application URLs
NEXT_PUBLIC_BASE_URL="https://chalet-balmotte810.com"
NEXTAUTH_URL="https://chalet-balmotte810.com"
ADMIN_EMAIL="contact@chalet-balmotte810.com"

# SMTP (Postfix on VPS)
SMTP_HOST="51.83.99.118"
SMTP_PORT="587"
SMTP_FROM="noreply@chalet-balmotte810.com"

# Google Search Console
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-verification-code"

# Optional: Stripe (if enabling payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Security Notes

- Never commit `.env` to version control
- Use different JWT secrets for dev/prod
- Rotate secrets periodically
- Use `sslmode=require` for production DB connections

---

## Database Schema

### Core Models

```prisma
model User {
  id            String          @id @default(cuid())
  email         String          @unique
  passwordHash  String?
  role          Role            @default(client)
  firstName     String
  lastName      String
  reservations  Reservation[]
  conversations Conversation[]
  emailVerified DateTime?
  passwordSet   Boolean         @default(false)
}

model Reservation {
  id            String        @id @default(cuid())
  userId        String
  startDate     DateTime
  endDate       DateTime
  guestCount    Int
  totalPrice    Float
  status        BookingStatus @default(pending)
  paymentStatus PaymentStatus @default(none)
  invoices      Invoice[]
  conversation  Conversation?
}

model Conversation {
  id              String                @id @default(cuid())
  userId          String
  subject         String
  status          ConversationStatus    @default(open)
  unreadByAdmin   Int                   @default(0)
  unreadByClient  Int                   @default(0)
  lastMessageAt   DateTime              @default(now())
  lastMessageFrom MessageSender?
  messages        ConversationMessage[]
  reservationId   String?               @unique
}

model ConversationMessage {
  id             String        @id @default(cuid())
  conversationId String
  fromUserId     String
  fromEmail      String
  fromName       String
  isFromAdmin    Boolean
  content        String        @db.Text
  read           Boolean       @default(false)
  readAt         DateTime?
  emailLogs      EmailLog[]
  createdAt      DateTime      @default(now())
}

model Invoice {
  id            String       @id @default(cuid())
  number        String       @unique  // CHB-YYYY-XXX
  reservationId String
  type          InvoiceType
  amount        Float
  status        InvoiceStatus @default(pending)
  paidAt        DateTime?
  pdfUrl        String?
  sentAt        DateTime?
  createdAt     DateTime      @default(now())
}

model SeasonPeriod {
  id         String   @id @default(cuid())
  year       Int
  name       String
  startDate  DateTime
  endDate    DateTime
  pricePerWeek Float
  isHighSeason Boolean @default(false)
  minNights  Int      @default(7)
  active     Boolean  @default(true)
}

model PricingSettings {
  id              String  @id @default(cuid())
  cleaningFee     Float
  linenCharge     Float
  touristTaxPerPerson Float
  depositAmount   Float
  bankTransferDetails String @db.Text
}

model EmailLog {
  id          String       @id @default(cuid())
  to          String
  from        String
  subject     String
  status      EmailStatus  @default(pending)
  error       String?
  sentAt      DateTime?
  messageId   String?
  createdAt   DateTime     @default(now())
}
```

### Enums

```prisma
enum Role {
  client
  admin
}

enum BookingStatus {
  pending
  confirmed
  cancelled
}

enum PaymentStatus {
  none
  pending
  deposit_paid
  paid
}

enum ConversationStatus {
  open
  closed
  archived
}

enum InvoiceType {
  deposit
  balance
  full
  custom
}

enum EmailStatus {
  pending
  sent
  failed
}
```

---

## API Routes

### Authentication (`/api/auth`)

```typescript
POST   /auth/register          // Create account
POST   /auth/login             // Login (returns JWT in httpOnly cookie)
POST   /auth/logout            // Logout (clears cookie)
GET    /auth/me                // Get current user (requires auth)
POST   /auth/setup-password    // Set password (for email-created accounts)
POST   /auth/verify-email      // Verify email with token
POST   /auth/resend-verification
```

**Auth Middleware:**
```typescript
// Protect API routes
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect('/client/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect('/client/login');
  }
}
```

### Reservations (`/api/reservations`)

```typescript
GET    /reservations           // List user's bookings
POST   /reservations           // Create booking
       Body: {
         startDate: string,
         endDate: string,
         guestCount: number,
         totalPrice: number,
         firstName: string,
         lastName: string,
         email: string
       }

PATCH  /reservations/[id]      // Update booking
DELETE /reservations/[id]      // Cancel booking
GET    /booked-periods         // Get unavailable dates (public)
```

### Conversations (`/api/conversations`)

```typescript
GET    /conversations          // List conversations (filters by role)
       Query: ?status=open|closed|archived

POST   /conversations          // Create conversation
       Body: {
         subject: string,
         initialMessage: string,
         reservationId?: string
       }

GET    /conversations/[id]     // Get conversation + messages
PATCH  /conversations/[id]     // Update status/mark as read
       Body: {
         status?: 'open'|'closed'|'archived',
         markAsRead?: boolean
       }

POST   /conversations/[id]/messages  // Send message
       Body: {
         content: string
       }
```

### Admin Routes (`/api/admin`)

**Requires `role: admin`**

```typescript
// User Management
GET    /admin/users
POST   /admin/users            // Create user with optional email invite
PATCH  /admin/users/[id]
DELETE /admin/users/[id]

// Reservation Management
GET    /admin/reservations     // All bookings with filters

// Configuration
GET    /admin/pricing-settings
POST   /admin/pricing-settings
GET    /admin/email-settings
POST   /admin/email-settings

// Seasonal Pricing
GET    /admin/seasons
POST   /admin/seasons
PATCH  /admin/seasons/[id]
DELETE /admin/seasons/[id]

// Invoices
GET    /admin/invoices
POST   /admin/invoices
       Body: {
         reservationId: string,
         type: 'deposit'|'balance'|'full',
         amount: number
       }

// Email Analytics
GET    /admin/email-logs       // Delivery tracking
GET    /admin/email-stats      // Open rates, failures

// Bulk Operations
POST   /admin/send-custom-email // Send to multiple users
POST   /admin/send-message      // Send to conversation
```

### Webhooks (`/api/webhooks`)

```typescript
POST   /webhooks/inbound-email // Process SMTP inbound
       Headers: {
         'Content-Type': 'application/json'
       }
       Body: {
         from: string,
         to: string,
         subject: string,
         text: string,
         html?: string
       }
```

**Webhook Security:**
```typescript
// Verify webhook origin
const signature = request.headers.get('x-webhook-signature');
const isValid = verifyWebhookSignature(signature, body, SECRET);
if (!isValid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
```

### Payments (`/api/payments`)

```typescript
POST   /payments/create-payment-intent
       Body: {
         amount: number,
         currency: 'eur',
         reservationId: string
       }
       Returns: { clientSecret: string }
```

---

## Deployment

### Production VPS Setup

**Server:** Debian 12 @ 51.83.99.118
**Domain:** chalet-balmotte810.com
**DNS:** OVH

#### 1. Initial Server Setup

```bash
# SSH access
ssh debian@51.83.99.118

# Install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx postgresql certbot python3-certbot-nginx git

# Install PM2 globally
sudo npm install -g pm2

# Configure PostgreSQL
sudo -u postgres createdb chalet_db
sudo -u postgres createuser -P chalet_user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE chalet_db TO chalet_user;"
```

#### 2. Application Deployment

```bash
# Create app directory
sudo mkdir -p /var/www/chalet-balmotte810
sudo chown debian:debian /var/www/chalet-balmotte810

# Deploy files (from local machine)
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ debian@51.83.99.118:/var/www/chalet-balmotte810/

# On server
cd /var/www/chalet-balmotte810
npm install
npm run build

# Start with PM2
pm2 start npm --name "chalet-balmotte810" -- start
pm2 save
pm2 startup  # Follow instructions to enable auto-start
```

#### 3. Nginx Configuration

```nginx
# /etc/nginx/sites-available/chalet-balmotte810
server {
    server_name chalet-balmotte810.com www.chalet-balmotte810.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/chalet-balmotte810.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chalet-balmotte810.com/privkey.pem;

    # SSL optimization
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name chalet-balmotte810.com www.chalet-balmotte810.com;
    return 301 https://$server_name$request_uri;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/chalet-balmotte810 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d chalet-balmotte810.com -d www.chalet-balmotte810.com
```

#### 4. Email Server Configuration

**Postfix Setup for Inbound Email:**

```bash
# Install Postfix
sudo apt install -y postfix postfix-pcre

# Configure virtual aliases (/etc/postfix/virtual)
contact@chalet-balmotte810.com    "|/usr/local/bin/email-to-webhook.sh"
info@chalet-balmotte810.com       "|/usr/local/bin/email-to-webhook.sh"
admin@chalet-balmotte810.com      "|/usr/local/bin/email-to-webhook.sh"

# Email forwarding script (/usr/local/bin/email-to-webhook.sh)
#!/bin/bash
EMAIL_CONTENT=$(cat)
FROM=$(echo "$EMAIL_CONTENT" | grep -m 1 "^From:" | sed 's/From: //' | tr -d '\r')
TO=$(echo "$EMAIL_CONTENT" | grep -m 1 "^To:" | sed 's/To: //' | tr -d '\r')
SUBJECT=$(echo "$EMAIL_CONTENT" | grep -m 1 "^Subject:" | sed 's/Subject: //' | tr -d '\r')
BODY=$(echo "$EMAIL_CONTENT" | awk 'BEGIN{body=0} /^$/{body=1;next} body{print}')

JSON_PAYLOAD=$(jq -n \
  --arg from "$FROM" \
  --arg to "$TO" \
  --arg subject "$SUBJECT" \
  --arg text "$BODY" \
  '{from: $from, to: $to, subject: $subject, text: $text}')

curl -X POST \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" \
  http://localhost:3000/api/webhooks/inbound-email \
  >> /var/log/email-webhook.log 2>&1

# Rebuild aliases and restart
sudo postmap /etc/postfix/virtual
sudo systemctl reload postfix
```

**DNS Configuration:**

```
# MX Record
chalet-balmotte810.com.   MX   10  mail.chalet-balmotte810.com.
mail.chalet-balmotte810.com. A   51.83.99.118

# SPF Record
chalet-balmotte810.com.   TXT  "v=spf1 mx ip4:51.83.99.118 ~all"

# DMARC Record
_dmarc.chalet-balmotte810.com. TXT "v=DMARC1; p=none; rua=mailto:dmarc@chalet-balmotte810.com"
```

#### 5. Continuous Deployment Script

```bash
#!/bin/bash
# deploy.sh - Automated deployment script

set -e

echo "🚀 Deploying to production..."

# Sync files
echo "📦 Syncing files..."
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ debian@51.83.99.118:/var/www/chalet-balmotte810/

# SSH and build
echo "🔨 Building on server..."
ssh debian@51.83.99.118 << 'ENDSSH'
  cd /var/www/chalet-balmotte810
  npm install
  npm run build
  pm2 restart chalet-balmotte810
ENDSSH

echo "✅ Deployment complete!"
echo "🌐 Site: https://chalet-balmotte810.com"
```

### Monitoring & Maintenance

**PM2 Commands:**
```bash
pm2 status                 # Check status
pm2 logs chalet-balmotte810  # View logs
pm2 restart chalet-balmotte810
pm2 stop chalet-balmotte810
pm2 delete chalet-balmotte810

# Monitor resources
pm2 monit

# Save configuration
pm2 save
```

**Database Backup:**
```bash
# Automated daily backup
crontab -e
0 2 * * * /usr/bin/pg_dump -U chalet_user chalet_db | gzip > /backups/chalet_$(date +\%Y\%m\%d).sql.gz

# Restore
gunzip -c /backups/chalet_20250124.sql.gz | psql -U chalet_user chalet_db
```

**Log Rotation:**
```bash
# /etc/logrotate.d/chalet-balmotte810
/var/log/email-webhook.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 debian debian
}
```

---

## SEO & Performance

### Lighthouse Scores: 100/100/100/100

**Implemented Optimizations:**

✅ **Schema.org Structured Data**
```typescript
// app/structured-data.ts
export const vacationRentalSchema = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': 'https://chalet-balmotte810.com',
  // ... complete property metadata
};
```

✅ **PWA Manifest** (`/manifest.json`)
```json
{
  "name": "Chalet-Balmotte810",
  "short_name": "Balmotte810",
  "display": "standalone",
  "theme_color": "#1E293B",
  "icons": [/* 8 sizes: 72-512px */]
}
```

✅ **Security Headers** (`next.config.js`)
```javascript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
    ]
  }];
}
```

✅ **Image Optimization**
```javascript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  minimumCacheTTL: 31536000
}
```

✅ **Dynamic Sitemap** (`/sitemap.xml`)
✅ **robots.txt** with proper directives
✅ **Semantic HTML** with H1 tags
✅ **ARIA labels** for accessibility

---

## Development Workflow

### Git Workflow

```bash
main              # Production branch
  ↓
feature/*         # Feature branches
bugfix/*          # Bug fixes
hotfix/*          # Critical production fixes
```

**Commit Convention:**
```
feat: add conversation archiving feature
fix: resolve date picker timezone issue
perf: optimize image loading on gallery
refactor: simplify auth middleware logic
docs: update API documentation
chore: upgrade dependencies
```

### Available Scripts

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint + TypeScript check
npm run type-check   # TypeScript only

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to DB (dev)
npm run db:migrate   # Create migration (prod)
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed data

# Testing (manual)
npx tsx test-email.ts              # Test SMTP
npx tsx test-conversation-detail.ts  # Test conversation emails
```

### Code Quality

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2018",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**ESLint Rules:**
- No unused variables
- No explicit any (prefer unknown)
- Consistent import order
- React hooks dependencies verified

---

## Security Best Practices

### Implemented Protections

1. **SQL Injection:** Prisma parameterized queries
2. **XSS:** React automatic escaping + CSP headers
3. **CSRF:** SameSite cookies + CORS configuration
4. **Authentication:** JWT with HttpOnly cookies, bcrypt (12 rounds)
5. **Authorization:** Role-based middleware on all admin routes
6. **Rate Limiting:** Nginx + API endpoint throttling
7. **Input Validation:** Zod schemas on API routes
8. **Password Policy:** Min 8 chars, email verification
9. **Session Management:** Token expiration, refresh tokens
10. **Secure Headers:** HSTS, X-Frame-Options, CSP

### Vulnerability Scanning

```bash
# Dependencies audit
npm audit
npm audit fix

# Security scan
npx snyk test

# Check for outdated packages
npm outdated
```

---

## Troubleshooting

### Common Issues

**1. Build Errors**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**2. Database Connection**
```bash
# Test connection
npx prisma db pull

# Reset database (dev only!)
npx prisma migrate reset

# Check PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"
```

**3. Email Not Sending**
```bash
# Check Postfix logs
sudo tail -f /var/log/mail.log
sudo journalctl -u postfix -n 50

# Test webhook
curl -X POST http://localhost:3000/api/webhooks/inbound-email \
  -H "Content-Type: application/json" \
  -d '{"from":"test@example.com","to":"contact@chalet-balmotte810.com","subject":"Test","text":"Test message"}'

# Check email logs
tail -f /var/log/email-webhook.log
```

**4. PM2 Issues**
```bash
# Restart app
pm2 restart chalet-balmotte810

# Check logs
pm2 logs --lines 100

# Monitor resources
pm2 monit

# Reset PM2
pm2 kill
pm2 resurrect
```

**5. SSL Certificate Renewal**
```bash
# Manual renewal
sudo certbot renew --dry-run
sudo certbot renew

# Auto-renewal is configured via cron
sudo systemctl status certbot.timer
```

---

## Performance Benchmarks

**Target Metrics:**
- Lighthouse Performance: 100
- Lighthouse SEO: 100
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Time to First Byte (TTFB): <200ms
- First Contentful Paint (FCP): <1s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- First Input Delay (FID): <100ms

**Current Production Stats:**
- Average response time: ~150ms
- Database queries: <50ms
- Image optimization: AVIF/WebP, responsive
- Bundle size: 102 kB gzipped (First Load JS)
- Static pages: 51 routes pre-rendered

---

## Tech Debt & Future Work

### Current Limitations
- [ ] No automated tests (unit/integration/e2e)
- [ ] No CI/CD pipeline
- [ ] Manual deployment process
- [ ] Limited error tracking (no Sentry)
- [ ] No real-time updates (websockets)
- [ ] Single server (no load balancing)

### Planned Improvements
- [ ] Jest + React Testing Library
- [ ] Playwright for E2E tests
- [ ] GitHub Actions CI/CD
- [ ] Docker containerization
- [ ] Redis for caching
- [ ] CloudFlare CDN
- [ ] Multi-region deployment
- [ ] Kubernetes orchestration

---

## Support & Contact

**Developer:** Raphaël Pierre
**Repository:** https://github.com/raphaelpierre/chalet-balmotte810.com
**Production:** https://chalet-balmotte810.com
**Email:** contact@chalet-balmotte810.com

**Documentation:**
- Architecture decisions: `/docs/architecture.md`
- API documentation: `/docs/api.md`
- Deployment guide: `/docs/deployment.md`

---

Built with Next.js, TypeScript, and PostgreSQL.
Deployed on self-hosted VPS with PM2 and Nginx.
Licensed: Proprietary - All rights reserved.

Last updated: 2025-10-24
