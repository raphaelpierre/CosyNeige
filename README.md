# 🏔️ Chalet Balmotte 810 - Système de Réservation Alpine

**Chalet Balmotte 810** est une plateforme de réservation pour un magnifique chalet alpin dans les Alpes françaises. Construit avec des technologies web modernes, il offre une expérience de réservation complète avec une interface utilisateur rationalisée, un support multilingue et une gestion complète des réservations.

🌐 **Site Web:** https://www.chalet-balmotte810.com

## ✨ Key Features

### 🏠 **Luxury Chalet Experience**
- **Premium mountain retreat** with stunning alpine views
- **Complete amenities showcase** with detailed descriptions
- **High-quality photo gallery** with categorized images
- **Interactive location mapping** and area information

### 🚀 **Enhanced Booking System**
- **Unified booking interface** with consolidated calendar and pricing calculator
- **Lightning-fast account creation** with incentive-driven registration flow
- **Real-time availability checking** and instant booking confirmation
- **Comprehensive payment options** (Stripe online payments + bank transfers)
- **Professional invoice generation** with PDF export functionality

### 👥 **User Management**
- **Secure authentication system** with JWT tokens and bcrypt hashing
- **Client dashboard** with booking history and profile management
- **Admin panel** with complete reservation and user management
- **Message center** for seamless host-guest communication

### 🌍 **Internationalization**
- **Full bilingual support** (French/English)
- **Context-aware translations** with custom language hooks
- **SEO-optimized multilingual content**

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.5.4** with App Router
- **React 19.1.0** with TypeScript
- **Tailwind CSS 4.0** for modern styling
- **jsPDF + html2canvas** for PDF generation
- **React DatePicker** for calendar functionality

### **Backend & Database**
- **Prisma ORM** with Neon PostgreSQL
- **NextAuth.js** for authentication
- **JWT tokens** for secure session management
- **bcryptjs** for password security

### **Payment & Communication**
- **Stripe integration** for secure online payments
- **Resend** for email notifications
- **Bank transfer support** with manual processing

### **Development & Deployment**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Vercel** for production deployment
- **Git** version control with GitHub

## 📊 Database Schema

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  firstName    String
  lastName     String
  phone        String?
  role         String        @default("client")
  password     String
  reservations Reservation[]
  messages     Message[]
  createdAt    DateTime      @default(now())
}

model Reservation {
  id           String   @id @default(cuid())
  checkIn      DateTime
  checkOut     DateTime
  guests       Int
  totalPrice   Float
  status       String   @default("pending")
  message      String?
  userId       String?
  guestEmail   String
  guestName    String
  guestPhone   String?
  user         User?    @relation(fields: [userId], references: [id])
  createdAt    DateTime @default(now())
}

model Message {
  id         String   @id @default(cuid())
  subject    String
  content    String
  userId     String?
  guestEmail String?
  guestName  String?
  isFromAdmin Boolean @default(false)
  read       Boolean  @default(false)
  replyTo    String?
  user       User?    @relation(fields: [userId], references: [id])
  createdAt  DateTime @default(now())
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String
  createdAt DateTime @default(now())
}

model BookedPeriod {
  id        String   @id @default(cuid())
  startDate DateTime
  endDate   DateTime
  reason    String?
  createdAt DateTime @default(now())
}
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL database (recommended: Neon.tech)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/raphaelpierre/CosyNeige.git
cd chalet-balmotte810
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env.local file
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key-32-chars-min"

# Optional: Email configuration
RESEND_API_KEY="your-resend-api-key"

# Optional: Stripe configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

4. **Initialize database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

6. **Open application**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
chalet-balmotte810/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── reservations/       # Booking management
│   │   ├── messages/           # Communication system
│   │   └── admin/              # Admin-only endpoints
│   ├── booking/                # Booking flow
│   │   ├── page.tsx           # Main booking page with unified interface
│   │   └── confirmation/       # Booking confirmation
│   ├── client/                 # Client area
│   │   ├── login/             # User authentication
│   │   └── dashboard/          # User dashboard with Suspense
│   ├── admin/                  # Admin panel
│   │   └── page.tsx           # Complete admin interface
│   ├── chalet/                 # Property showcase
│   ├── gallery/                # Photo gallery
│   ├── location/               # Area information
│   └── contact/                # Contact form
├── components/                  # Reusable components
│   ├── booking/               # Booking-specific components
│   ├── invoice/               # PDF generation components
│   │   ├── AdminInvoiceGeneratorFixed.tsx  # Fixed PDF generator
│   │   └── InvoiceGenerator.tsx            # Client invoice component
│   ├── layout/                # Navigation and footer
│   └── ui/                    # Generic UI components
├── lib/                        # Utilities and configurations
│   ├── data/                  # Static chalet data
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # React context providers
│   └── utils/                 # Helper functions
├── prisma/                     # Database configuration
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
└── public/                     # Static assets
```

## 🎯 Enhanced Features

### **Optimized Booking Experience**
- **Single-page booking flow** with unified calendar and calculator
- **Account creation incentives** with clear benefits (auto-fill, history, exclusive offers)
- **Improved button accessibility** with enhanced contrast
- **Payment transparency** with detailed Stripe and bank transfer information

### **Professional PDF Generation**
- **CSS-compatible invoice generator** using inline styles
- **Professional invoice templates** with chalet branding
- **Cross-browser PDF generation** support
- **Automatic invoice numbering** and date formatting

### **Modern User Interface**
- **Responsive design** optimized for all devices
- **Smooth animations** and hover effects
- **Accessibility-first** approach with proper ARIA labels
- **Loading states** and error handling throughout

### **Advanced Admin Features**
- **Complete reservation management** with status updates
- **User management** with role-based access
- **Message center** with real-time communication
- **Invoice generation** and export functionality

## 🏗️ API Reference

### **Authentication**
```typescript
POST /api/auth/register    // User registration
POST /api/auth/login       // User authentication
POST /api/auth/logout      // Session termination
GET  /api/auth/me          // Current user information
```

### **Reservations**
```typescript
GET    /api/reservations      // List reservations (user-specific or admin)
POST   /api/reservations      // Create new reservation
PUT    /api/reservations/[id] // Update reservation details
DELETE /api/reservations/[id] // Cancel reservation
```

### **Communication**
```typescript
GET  /api/messages           // Retrieve user messages
POST /api/messages           // Send new message
POST /api/contact            // Submit contact form
```

### **Admin Endpoints**
```typescript
GET    /api/admin/reservations // All reservations management
GET    /api/admin/users        // User management
GET    /api/admin/messages     // Message management
DELETE /api/admin/messages/[id] // Delete messages
```

## 🎨 Design System

### **Color Palette**
- **Primary:** Forest Green (#1a5b3c)
- **Secondary:** Warm Gold (#d4af37)
- **Accent:** Mountain Blue (#2563eb)
- **Neutral:** Warm Grays (#64748b, #94a3b8, #e2e8f0)

### **Typography**
- **Headings:** Bold, modern sans-serif
- **Body:** Clean, readable typography
- **Buttons:** Clear, actionable text with icons

### **Components**
- **Cards:** Rounded corners with subtle shadows
- **Buttons:** Gradient backgrounds with hover effects
- **Forms:** Clear labels with validation states
- **Modals:** Centered overlays with backdrop blur

## 🔐 Security Features

- **Password hashing** with bcryptjs (12 rounds)
- **JWT session management** with secure secrets
- **Input validation** and XSS protection
- **CSRF protection** via NextAuth.js
- **Role-based access control** (client/admin)
- **Protected API routes** with authentication middleware

## 📈 Performance Optimizations

- **Next.js App Router** with automatic code splitting
- **Static page generation** for public content
- **Image optimization** with Next.js Image component
- **Lazy loading** for photo galleries
- **Database query optimization** with Prisma
- **Vercel Edge Functions** for API routes

## 🚀 Deployment

### **Vercel Deployment** (Current)
```bash
npx vercel --prod
```

**Production URL:** https://www.chalet-balmotte810.com

### **Environment Configuration**
Ensure these variables are set in Vercel dashboard:
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.vercel.app
JWT_SECRET=your-jwt-secret
```

### **Database Setup**
1. Create PostgreSQL database (Neon.tech recommended)
2. Run migrations: `npx prisma migrate deploy`
3. Generate Prisma client: `npx prisma generate`

## 🛣️ Roadmap

### **Phase 1: Enhanced Features** ✅
- [x] Unified booking interface
- [x] Account creation incentives
- [x] PDF generation fixes
- [x] Payment information enhancement
- [x] Vercel deployment

### **Phase 2: Payment Integration** 🚧
- [ ] Complete Stripe payment flow
- [ ] Automated invoice generation
- [ ] Payment confirmation emails
- [ ] Refund management system

### **Phase 3: Advanced Features** 📋
- [ ] Calendar synchronization (Airbnb, Booking.com)
- [ ] Automated email workflows
- [ ] Review and rating system
- [ ] Dynamic pricing algorithm
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

### **Phase 4: Business Features** 🎯
- [ ] Multi-property support
- [ ] Property management tools
- [ ] Revenue analytics
- [ ] Guest communication automation
- [ ] Maintenance scheduling
- [ ] Insurance integration

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make changes** with proper TypeScript types
4. **Test thoroughly** (build, functionality, responsiveness)
5. **Commit changes** (`git commit -m 'Add amazing feature'`)
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Open Pull Request** with detailed description

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add JSDoc comments for functions
- Ensure mobile responsiveness
- Test with both French and English content

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

**Developer:** Raphaël Pierre  
**GitHub:** [@raphaelpierre](https://github.com/raphaelpierre)  
**Project Repository:** [Chalet Balmotte 810](https://github.com/raphaelpierre/CosyNeige)  
**Live Application:** [Chalet Balmotte 810](https://www.chalet-balmotte810.com)

---

## 🏔️ À propos du Chalet Balmotte 810

*Le Chalet Balmotte 810 représente la fusion parfaite entre la technologie moderne et l'hospitalité alpine. Notre plateforme transforme l'expérience traditionnelle de location de chalet avec des réservations simplifiées, une tarification transparente et une expérience utilisateur exceptionnelle - tout en préservant le charme authentique des retraites de montagne.*

**Découvrez la magie des Alpes françaises avec le Chalet Balmotte 810 - où la technologie rencontre la sérénité montagnarde.** ✨

---

*Built with ❤️ for the mountains | Deployed on Vercel | Powered by Next.js*

## ✨ Features

### 🏠 **Chalet Showcase**

- **10-person capacity** luxury chalet with 4 bedrooms, 3 bathrooms (180m²)
- **Premium amenities**: Private sauna, outdoor hot tub, wood fireplace, ski room
- **Strategic location** between Arve and Giffre valleys
- **Access to 5 major ski resorts** within 30 minutes

### 📱 **User Experience**

- **Responsive design** optimized for all devices
- **Bilingual support** (English/French) with context-aware translation
- **Interactive booking calendar** with real-time availability
- **Photo gallery** with categorized images
- **Guest testimonials** and detailed amenities showcase

### 🔧 **Technical Features**

- **Real-time booking system** with calendar integration
- **User authentication** with NextAuth.js
- **Admin dashboard** for reservation management
- **Contact messaging system**
- **Automated availability tracking**

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15.5.4** (App Router)
- **React 19.1.0** with TypeScript
- **Tailwind CSS 4** for styling
- **Custom language hook** for i18n

### **Backend & Database**

- **Prisma ORM** with SQLite database
- **NextAuth.js** for authentication
- **bcryptjs** for password hashing
- **JWT tokens** for session management

### **APIs & Integration**

- **REST API routes** for all CRUD operations
- **Unsplash integration** for high-quality imagery
- **Responsive image optimization**

## 📊 Database Schema

```sql
User           - User accounts with authentication
Reservation    - Booking management with guest details
Message        - Internal messaging system
ContactMessage - Public contact form submissions
BookedPeriod   - Availability tracking
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+
- npm, yarn, or pnpm

### **Installation**

1. **Clone the repository**

```bash
git clone https://github.com/raphaelpierre/Chalet-Balmotte810.git
cd Chalet-Balmotte810
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

```bash
# Create .env.local file
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Initialize database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open application**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```text
Chalet-Balmotte810/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (auth, reservations, messages)
│   ├── booking/           # Booking flow pages
│   ├── client/            # Client dashboard
│   ├── admin/             # Admin panel
│   └── [pages]/           # Public pages
├── components/            # Reusable UI components
│   ├── booking/          # Booking-specific components
│   ├── layout/           # Layout components (Nav, Footer)
│   └── ui/               # Generic UI components
├── lib/                  # Utilities and configurations
│   ├── data/             # Static data (chalet info, pricing)
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functions
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🎯 Key Pages & Features

### **Public Pages**

- **Homepage** (`/`) - Hero showcase with chalet overview
- **Chalet Details** (`/chalet`) - Detailed property information
- **Gallery** (`/gallery`) - Photo gallery with categories
- **Booking** (`/booking`) - Interactive booking calendar
- **Location** (`/location`) - Area information and activities
- **Contact** (`/contact`) - Contact form and information

### **User Features**

- **Client Dashboard** (`/client/dashboard`) - Booking management
- **Booking Confirmation** (`/booking/confirmation`) - Post-booking details

### **Admin Features**

- **Admin Panel** (`/admin`) - Comprehensive management dashboard
- **Reservation Management** - View, confirm, cancel bookings
- **Message Center** - Handle customer inquiries
- **Availability Control** - Manage blocked periods

## 🌍 Internationalization

The platform supports **English** and **French** with:

- Context-aware translations using custom `useLanguage` hook
- Seamless language switching
- Localized content for all user-facing text
- SEO-friendly multilingual URLs

## 🏗️ API Endpoints

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user info

### **Reservations**

- `GET /api/reservations` - List all reservations
- `POST /api/reservations` - Create new reservation
- `PUT /api/reservations/[id]` - Update reservation
- `DELETE /api/reservations/[id]` - Cancel reservation

### **Availability**

- `GET /api/booked-periods` - Get unavailable dates
- `POST /api/booked-periods` - Block periods

### **Communication**

- `GET /api/messages` - Retrieve messages
- `POST /api/messages` - Send new message

## 🎨 Design System

- **Forest Green** primary color scheme
- **Gold accents** for premium feel
- **Responsive grid layouts**
- **Smooth animations** and transitions
- **Mountain photography** integration
- **Accessibility-first** approach

## 🔐 Security Features

- **Password hashing** with bcryptjs
- **JWT session management**
- **Input validation** and sanitization
- **Protected API routes**
- **CSRF protection** with NextAuth.js

## 📈 Performance Optimizations

- **Next.js Image optimization**
- **Lazy loading** for gallery images
- **Code splitting** with App Router
- **Static generation** for public pages
- **Database query optimization**

## 🚀 Deployment

The application is optimized for deployment on:

### **Vercel (Recommended)**

```bash
vercel --prod
```

### **Alternative Platforms**

- Railway
- Netlify
- DigitalOcean App Platform
- Traditional VPS with Docker

## 🛣️ Roadmap

- [ ] **Payment integration** (Stripe/PayPal)
- [ ] **Calendar synchronization** with external platforms
- [ ] **Email notifications** for bookings
- [ ] **Mobile app** (React Native)
- [ ] **Advanced analytics** dashboard
- [ ] **Multi-property support**
- [ ] **Guest review system**
- [ ] **Automated pricing** based on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Raphaël Pierre** - [@raphaelpierre](https://github.com/raphaelpierre)

Project Link: [https://github.com/raphaelpierre/Chalet-Balmotte810](https://github.com/raphaelpierre/Chalet-Balmotte810)

---

*Experience the magic of the French Alps with Chalet-Balmotte810 - where luxury meets authentic mountain charm.* 🏔️✨
