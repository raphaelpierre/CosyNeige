# Chalet-Balmotte810.com

A comprehensive booking and property management platform for a luxury alpine chalet in the French Alps.

**Live Site:** https://chalet-balmotte810.com

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Production Environment](#production-environment)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Chalet-Balmotte810.com is a full-stack web application built for managing a luxury 10-person alpine chalet (200m²) located in the French Alps, strategically positioned between the Arve and Giffre valleys with access to 5 ski resorts within 30 minutes.

### Property Features
- 4 bedrooms, 3 bathrooms (200m²)
- Premium amenities: private sauna, outdoor jacuzzi, fireplace, ski room
- Capacity: 10 guests
- Prime location with access to multiple ski resorts

---

## Features

### Booking System
- **Interactive Calendar**: Real-time availability checking with French locale support
- **Automated Pricing**: Seasonal pricing calculator with high/low season management
- **Multiple Payment Methods**:
  - Stripe integration (credit card, Apple Pay, Google Pay)
  - Bank transfer option
- **Professional Invoice Generation**: Automated PDF invoices with custom branding
- **Instant Confirmation**: Automated email confirmations for bookings

### User Management
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Role-Based Access Control**: Client and admin roles
- **Client Dashboard**: View reservations, manage profile, access conversations
- **Admin Panel**: Complete management of reservations, users, conversations, invoices

### Conversation System
- **Unified Messaging**: Thread-based conversations with read/unread tracking
- **Email Integration**: Automated notifications with reply-to functionality
- **Smart Filtering**: Filter by status (open/closed/archived) and unread messages
- **Sorting Options**: Sort by unread first, newest, or oldest
- **Quick Actions**: Mark as read, archive, change status
- **SMTP Inbound**: Receive emails directly into conversations via webhook

### Multilingual Support
- **French/English**: Full bilingual interface
- **Contextual Translations**: Custom translation hook for dynamic content
- **SEO Optimized**: Proper meta tags and content for both languages

### Admin Features
- **Reservation Management**: Create, modify, cancel reservations with status tracking
- **User Management**: Manage client accounts and admin access
- **Invoice System**: Generate, send, and track invoices with PDF export
- **Season Management**: Configure pricing periods with custom rates
- **Email Configuration**: Manage notification settings and forwarding addresses
- **Accounting Module**: Track income/expenses with categorization
- **Calendar View**: Visual representation of bookings and availability

---

## Tech Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **React DatePicker** - Calendar component
- **jsPDF + html2canvas** - PDF generation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database ORM with PostgreSQL
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL** - Primary database
- **NeonDB** - Serverless PostgreSQL provider (development)
- **Self-hosted PostgreSQL** - Production VPS deployment

### External Services
- **Stripe** - Payment processing
- **Resend** - Transactional emails
- **SMTP Server** - Inbound email handling

### Deployment & Infrastructure
- **Self-Hosted VPS** - Debian server (production)
- **PM2** - Node.js process manager
- **Nginx** - Reverse proxy with SSL
- **Vercel Analytics** - Performance monitoring
- **GitHub** - Version control

---

## Architecture

### Application Structure
```
Next.js App Router (Server Components + Client Components)
    ↓
API Routes (Serverless Functions)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

### Authentication Flow
```
Login Request → JWT Token Generation → HttpOnly Cookie → API Middleware Validation
```

### Conversation Flow
```
Client Email → SMTP Server → Webhook → API → Database → Admin Notification
Admin Reply → API → Email Service → Client Email
```

### Payment Flow
```
Booking → Stripe Payment Intent → Payment Form → Stripe Confirmation → Database Update → Invoice Generation → Email Notification
```

---

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- SMTP server (for email functionality)
- Stripe account (for payments)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/raphaelpierre/chalet-balmotte810.com.git
cd chalet-balmotte810.com
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Initialize database**
```bash
npx prisma generate
npx prisma db push
```

5. **Seed seasonal data (optional)**
```bash
npm run db:seed
```

6. **Run development server**
```bash
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin
- Prisma Studio: `npm run db:studio`

---

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
JWT_SECRET="your-secret-key-minimum-32-characters"
NEXTAUTH_SECRET="your-nextauth-secret-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"  # or production URL

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # or production URL
ADMIN_EMAIL="admin@chalet-balmotte810.com"

# Email Service (Resend)
RESEND_API_KEY="re_your_resend_api_key"
RESEND_ADMIN_EMAILS="admin1@example.com,admin2@example.com"
NEXT_PUBLIC_CONTACT_EMAIL="contact@chalet-balmotte810.com"

# SMTP Server (for inbound emails)
USE_SMTP="true"
SMTP_HOST="mail.chalet-balmotte810.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="noreply@chalet-balmotte810.com"
SMTP_PASS="your-smtp-password"

# Stripe (optional, for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Webhook Secret (for inbound email processing)
WEBHOOK_SECRET="your-webhook-secret-key"
```

### Development vs Production

**Development:**
- Use local PostgreSQL or NeonDB
- Use Resend test API key
- Use Stripe test keys
- Set `NEXTAUTH_URL` to `http://localhost:3000`

**Production:**
- Use production PostgreSQL database
- Use Resend production API key
- Use Stripe live keys
- Set `NEXTAUTH_URL` to your domain
- Configure SMTP server for inbound emails

---

## Database Schema

### Core Models

**User**
- Authentication and role management (client/admin)
- Linked to reservations and conversations
- Password reset token support

**Reservation**
- Booking information with guest details
- Status tracking (pending/confirmed/cancelled)
- Payment status (none/pending/deposit_paid/paid)
- Linked to user, invoices, and conversations

**Conversation**
- Thread-based messaging system
- Status management (open/closed/archived)
- Unread counters for both admin and client
- Linked to user, reservation, and messages

**ConversationMessage**
- Individual messages within conversations
- Email logging integration
- Read tracking with timestamps

**Invoice**
- Professional invoice generation
- Multiple types (deposit/balance/full/custom)
- PDF export support
- Payment tracking

**SeasonPeriod**
- Seasonal pricing configuration
- High/low season designation
- Minimum stay requirements
- Sunday-to-Sunday restrictions

**PricingSettings**
- Global pricing configuration
- Cleaning fees, linen charges
- Tourist tax, deposit amounts

**EmailLog**
- Email delivery tracking
- Status monitoring (pending/sent/failed)
- Error logging

### Model Relationships

```
User ←→ Reservation
User ←→ Conversation
Reservation ←→ Invoice
Reservation ←→ Conversation
Conversation ←→ ConversationMessage
ConversationMessage ←→ EmailLog
```

---

## API Routes

### Authentication
```
POST   /api/auth/register          # Create new user account
POST   /api/auth/login             # Authenticate user
POST   /api/auth/logout            # Logout user
GET    /api/auth/me                # Get current user info
POST   /api/auth/setup-password    # Set password for new user
POST   /api/auth/verify-email      # Verify email address
POST   /api/auth/resend-verification  # Resend verification email
```

### Reservations
```
GET    /api/reservations           # List user's reservations
POST   /api/reservations           # Create new reservation
PATCH  /api/reservations/[id]      # Update reservation
DELETE /api/reservations/[id]      # Cancel reservation
GET    /api/booked-periods         # Get booked date ranges
```

### Conversations
```
GET    /api/conversations          # List conversations
POST   /api/conversations          # Create new conversation
GET    /api/conversations/[id]     # Get conversation with messages
PATCH  /api/conversations/[id]     # Update conversation status/read
POST   /api/conversations/[id]/messages  # Send message in conversation
```

### Admin Routes
```
GET    /api/admin/reservations     # All reservations (admin only)
GET    /api/admin/users            # All users (admin only)
POST   /api/admin/users            # Create user (admin only)
PATCH  /api/admin/users/[id]       # Update user (admin only)
DELETE /api/admin/users/[id]       # Delete user (admin only)
GET    /api/admin/email-settings   # Get email configuration
POST   /api/admin/email-settings   # Update email configuration
GET    /api/admin/pricing-settings # Get pricing configuration
POST   /api/admin/pricing-settings # Update pricing configuration
GET    /api/admin/seasons          # Get seasonal periods
POST   /api/admin/seasons          # Create season period
PATCH  /api/admin/seasons/[id]     # Update season period
DELETE /api/admin/seasons/[id]     # Delete season period
GET    /api/admin/invoices         # All invoices
POST   /api/admin/invoices         # Create invoice
GET    /api/admin/email-logs       # Email delivery logs
GET    /api/admin/email-stats      # Email statistics
```

### Webhooks
```
POST   /api/webhooks/inbound-email # Process inbound SMTP emails
```

### Payments
```
POST   /api/payments/create-payment-intent  # Create Stripe payment
```

---

## Deployment

### Production Environment (Self-Hosted VPS)

**Server Specifications:**
- Debian Linux server
- Nginx reverse proxy with SSL (Let's Encrypt)
- PM2 process manager
- PostgreSQL database
- SMTP server for email handling

**Deployment Process:**

1. **Build the application**
```bash
npm run build
```

2. **Sync files to VPS**
```bash
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ user@your-vps-ip:/var/www/chalet-balmotte810/
```

3. **SSH into VPS and setup**
```bash
ssh user@your-vps-ip
cd /var/www/chalet-balmotte810
npm install
npm run build
```

4. **Start/Restart with PM2**
```bash
pm2 restart chalet-balmotte810
# or for first time
pm2 start npm --name "chalet-balmotte810" -- start
pm2 save
pm2 startup
```

5. **Configure Nginx**
```nginx
server {
    server_name chalet-balmotte810.com www.chalet-balmotte810.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/chalet-balmotte810.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chalet-balmotte810.com/privkey.pem;
}
```

6. **Setup SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d chalet-balmotte810.com -d www.chalet-balmotte810.com
```

### Email Configuration

**SMTP Inbound Setup:**
1. Configure MX records pointing to your VPS
2. Setup SMTP server (Postfix) to forward emails to webhook
3. Configure DNS (SPF, DKIM, DMARC) for deliverability

**Resend Setup:**
1. Verify domain in Resend dashboard
2. Add DNS records for authentication
3. Configure API key in environment variables

---

## Project Structure

```
chalet-balmotte810/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── admin/              # Admin-only endpoints
│   │   ├── conversations/      # Conversation management
│   │   ├── reservations/       # Booking management
│   │   ├── payments/           # Stripe integration
│   │   └── webhooks/           # External webhooks
│   ├── admin/                  # Admin dashboard
│   │   ├── conversations/      # Conversation management UI
│   │   └── page.tsx            # Main admin panel
│   ├── booking/                # Booking flow
│   │   ├── payment/            # Payment pages
│   │   └── confirmation/       # Booking confirmation
│   ├── client/                 # Client area
│   │   ├── dashboard/          # Client dashboard
│   │   ├── conversations/      # Client conversations
│   │   └── login/              # Client login
│   ├── chalet/                 # Chalet information
│   ├── gallery/                # Photo gallery
│   ├── guide/                  # Travel guide
│   ├── location/               # Location info
│   ├── contact/                # Contact form
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                 # React components
│   ├── booking/                # Booking components
│   │   └── BookingCalendar.tsx
│   ├── invoice/                # Invoice generation
│   │   ├── InvoiceModal.tsx
│   │   └── InvoicePDF.tsx
│   ├── layout/                 # Layout components
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── payment/                # Payment components
│   └── ui/                     # UI primitives
├── lib/                        # Utilities and helpers
│   ├── context/                # React contexts
│   │   ├── LanguageContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/                  # Custom hooks
│   │   └── useLanguage.ts
│   ├── utils/                  # Helper functions
│   │   └── auth.ts
│   ├── data/                   # Static data
│   │   └── chalet-data.ts
│   ├── prisma.ts               # Prisma client
│   ├── conversation-emails.ts  # Email templates
│   └── smtp.ts                 # SMTP configuration
├── prisma/                     # Database
│   ├── schema.prisma           # Database schema
│   └── seed-seasons.ts         # Seed data
├── public/                     # Static assets
│   └── images/                 # Property images
├── scripts/                    # Utility scripts
│   ├── check-dns.sh
│   └── test-email.sh
├── .env                        # Environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## Development Workflow

### Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed seasonal periods
```

### Development Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Component Structure**: Prefer server components when possible
3. **API Routes**: Include proper error handling and validation
4. **Authentication**: Check user roles before sensitive operations
5. **Email Templates**: Test with both Resend and SMTP
6. **Responsive Design**: Test on mobile, tablet, and desktop
7. **Bilingual Support**: Always provide both FR and EN translations

### Testing

**Manual Testing Checklist:**
- Booking flow (calendar, pricing, payment)
- User authentication (register, login, password reset)
- Conversation system (create, reply, mark as read)
- Admin panel (manage reservations, users, conversations)
- Invoice generation and PDF export
- Email notifications (booking, messages, invoices)
- Payment processing (Stripe and bank transfer)

**Email Testing:**
```bash
# Test SMTP configuration
npx tsx test-smtp.ts

# Test Resend API
npx tsx test-resend-email.ts

# Test conversation emails
npx tsx test-conversation-detail.ts
```

---

## Production Environment

### Current Deployment

**Domain:** https://chalet-balmotte810.com
**Hosting:** Self-hosted VPS (Debian)
**Database:** PostgreSQL (local)
**Process Manager:** PM2
**Web Server:** Nginx with SSL

### Monitoring

**Application Logs:**
```bash
ssh user@vps
pm2 logs chalet-balmotte810
```

**Database Access:**
```bash
# Via Prisma Studio
npm run db:studio

# Direct PostgreSQL
psql -h localhost -U postgres -d chalet_db
```

**Email Logs:**
- Check `/api/admin/email-logs` in admin panel
- Review EmailLog table in database

### Backup Strategy

**Database Backups:**
```bash
# Export data
npx tsx export-data.ts

# Import data
npx tsx import-data.ts
```

**File Backups:**
- Regular VPS snapshots
- Git version control for code
- Separate backup of uploaded images/PDFs

---

## Key Features Implementation

### Conversation System

The conversation system replaces the legacy message system with a unified, thread-based approach:

**Features:**
- Threaded conversations with multiple messages
- Real-time unread counters (separate for admin and client)
- Email notifications with reply-to functionality
- Inbound email processing via SMTP webhook
- Status management (open/closed/archived)
- Smart filtering and sorting
- Auto mark-as-read on view
- Quick actions (mark read, archive)

**Implementation:**
- `Conversation` model with status and counters
- `ConversationMessage` model for individual messages
- `EmailLog` for tracking email delivery
- Webhook endpoint for inbound SMTP emails
- Automated email templates with HTML/plain text

### Invoice System

Professional invoice generation with PDF export:

**Features:**
- Multiple invoice types (deposit/balance/full/custom)
- Automated numbering (CHB-YYYY-XXX format)
- PDF generation with custom branding
- Email delivery with attachments
- Payment tracking and status
- Linked to reservations

**Implementation:**
- `Invoice` model with comprehensive fields
- jsPDF + html2canvas for PDF generation
- Customizable invoice templates
- Automated email sending with Resend
- Invoice preview before sending

### Seasonal Pricing

Dynamic pricing based on seasonal periods:

**Features:**
- Define custom date ranges with specific pricing
- High season / low season designation
- Minimum stay requirements
- Sunday-to-Sunday booking restrictions
- Year-based organization
- Active/inactive period management

**Implementation:**
- `SeasonPeriod` model with flexible configuration
- Pricing calculator in booking flow
- Admin interface for period management
- Automatic price calculation based on dates

---

## Security

### Authentication & Authorization
- JWT tokens with HttpOnly cookies
- bcrypt password hashing (12 rounds)
- Role-based access control (client/admin)
- Protected API routes with middleware
- Token expiration and refresh

### Data Protection
- Prisma parameterized queries (SQL injection prevention)
- Input validation and sanitization
- XSS protection via React
- CSRF protection via SameSite cookies
- Secure environment variable handling

### Email Security
- SPF, DKIM, DMARC configuration
- SMTP TLS encryption
- Email verification for new accounts
- Rate limiting on email endpoints
- Webhook secret validation

---

## Performance Optimizations

- Next.js App Router with server components
- Static page generation where possible
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Prisma connection pooling
- Edge functions for API routes
- CDN for static assets

---

## Future Enhancements

### Planned Features
- Calendar synchronization (Airbnb, Booking.com)
- Guest review system
- Dynamic pricing based on demand
- Advanced analytics dashboard
- Mobile application (React Native)
- Automated cleaning schedule management
- Multi-property support
- WhatsApp integration
- SMS notifications
- Automated guest communication templates

### Technical Improvements
- Comprehensive test suite (Jest, Playwright)
- CI/CD pipeline with GitHub Actions
- Docker containerization
- Kubernetes orchestration
- Redis caching layer
- GraphQL API option
- WebSocket for real-time updates
- Progressive Web App (PWA)

---

## Contributing

This is a private project, but contributions are welcome for bug fixes and improvements.

### Guidelines
1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Ensure bilingual support (FR/EN)
4. Test on multiple devices
5. Document new features
6. Follow existing code style

---

## License

This project is proprietary software. All rights reserved.

**Developer:** Raphaël Pierre
**Repository:** https://github.com/raphaelpierre/chalet-balmotte810.com
**Live Site:** https://chalet-balmotte810.com
**Contact:** contact@chalet-balmotte810.com

---

## Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Database Connection Issues:**
```bash
# Verify DATABASE_URL in .env
# Check PostgreSQL is running
# Test connection with Prisma
npx prisma db pull
```

**Email Not Sending:**
- Verify RESEND_API_KEY is correct
- Check email logs in admin panel
- Ensure domain is verified in Resend
- Test SMTP configuration

**Payment Issues:**
- Verify Stripe keys are correct
- Check webhook configuration
- Review Stripe dashboard for errors

### Support

For technical issues or questions:
- Check existing GitHub issues
- Create new issue with detailed description
- Contact: contact@chalet-balmotte810.com

---

Built with Next.js, React, TypeScript, and Tailwind CSS.
Deployed on self-hosted VPS with PM2 and Nginx.
Powered by PostgreSQL, Prisma, Stripe, and Resend.
