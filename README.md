# 🏔️ CosyNeige - Alpine Chalet Rental Platform

**CosyNeige** is a luxury alpine chalet rental platform showcasing a beautiful mountain retreat in Châtillon-sur-Cluses, French Alps. The platform provides a complete booking experience with multilingual support, integrated reservation management, and stunning visual presentation.

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
git clone https://github.com/raphaelpierre/CosyNeige.git
cd CosyNeige
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

```
CosyNeige/
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

Project Link: [https://github.com/raphaelpierre/CosyNeige](https://github.com/raphaelpierre/CosyNeige)

---

*Experience the magic of the French Alps with CosyNeige - where luxury meets authentic mountain charm.* 🏔️✨
