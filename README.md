# TrueTestify MVP - Video Testimonial Platform

A lightweight video testimonial SaaS focused on video-first collection, display, and trust-building — optimized for ease of use, fast embeds, and emotional impact.

## 🎯 Core Purpose

TrueTestify is video-only by design — because faces build trust more than stars and text ever could.

## 🏗️ Project Structure

```
Test Truetestify/
├── backend/          # NestJS API server
├── frontend/         # React frontend application
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis (optional, for caching)
- AWS S3 account (for video storage)
- Stripe account (for billing)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your actual values:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/truetestify?schema=public"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   
   # Server
   PORT=3000
   NODE_ENV="development"
   
   # Frontend URL for CORS
   FRONTEND_URL="http://localhost:5173"
   
   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET="truetestify-videos"
   
   # Stripe Configuration
   STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"
   
   # Redis (for caching)
   REDIS_URL="redis://localhost:6379"
   ```

4. **Set up database:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3000`
   API documentation will be available at `http://localhost:3000/api-docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file:
   ```env
   VITE_BASE_URL="http://localhost:3000"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 🔑 Core Features

### ✅ 1. Video Review Collection
- Record or upload testimonials directly in-browser or mobile
- Max 60 seconds
- Auto-compress to 720p
- Preview before submission

### ✅ 2. Public Review Page
- Example: `truetestify.com/yourbusiness`
- Displays hero video gallery
- Business branding (logo, colors)
- CTA to "Leave a Review"

### ✅ 3. Embeddable Widget
- Auto-generated widget code
- Widget layouts: Grid, Carousel, Spotlight, Floating bubble

### ✅ 4. Moderation System
- Dashboard to approve/reject reviews
- Reorder display
- Toggle visibility

### ✅ 5. Storage-Based Billing
- Stripe integration
- Pricing tiers based on GB of video stored
- Auto-hide widgets on payment failure

### ✅ 6. Basic Analytics
- Videos collected
- Widget views
- Storage remaining

### ✅ 7. Privacy + Legal Compliance
- Consent checkbox before recording
- GDPR/CCPA compliant
- User right-to-delete supported

## 🎨 Branding and Colors

- **Blue**: Trust, reliability, professionalism
- **Orange**: Energy, call-to-action, friendliness
- **Logo base**: Blue (dark/navy or SaaS blue)
- **CTA buttons**: Orange (#FFA500 or #FF7F50)
- **Widget accents**: Orange border or background highlights

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/users/:id` - Get user info

### Tenants
- `GET /api/v1/tenants/:slug` - Get tenant by slug
- `GET /api/v1/tenants/slug/:slug` - Get tenant by slug (alternative)
- `PATCH /api/v1/tenants/:id` - Update tenant

### Reviews
- `POST /api/v1/reviews/:tenantSlug` - Submit review (public)
- `GET /api/v1/reviews/tenant/:tenantId` - Get reviews by tenant
- `GET /api/v1/reviews/:id` - Get specific review
- `PATCH /api/v1/reviews/:id/approve` - Approve review
- `PATCH /api/v1/reviews/:id/reject` - Reject review
- `PATCH /api/v1/reviews/:id/hide` - Hide review

### Widgets
- `POST /api/v1/widgets` - Create widget
- `GET /api/v1/widgets/tenant/:tenantId` - Get widgets by tenant
- `GET /api/v1/widgets/:id` - Get specific widget
- `PATCH /api/v1/widgets/:id` - Update widget

### Analytics
- `GET /api/v1/analytics/tenant/:tenantId` - Get tenant analytics
- `GET /api/v1/analytics/widget/:widgetId/views` - Get widget views

### Billing
- `GET /api/v1/billing/tenant/:tenantId` - Get billing account
- `POST /api/v1/billing/checkout` - Create checkout session
- `POST /api/v1/billing/portal` - Create portal session

## 🛠️ Development

### Backend Development
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **File Storage**: AWS S3
- **Payment Processing**: Stripe
- **Caching**: Redis (optional)

### Frontend Development
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Animations**: Framer Motion

## 📱 Platform Integrations

### WordPress Plugin
- Lightweight UI plugin for embedding widgets
- Shortcode support: `[truetestify_widget type="carousel"]`
- OAuth integration for account connection

### Shopify App
- Embedded app for Shopify stores
- OAuth login flow
- Widget placement on product pages and home page
- QR code generation for packaging

## 🔒 Security Features

- JWT-based authentication
- CORS configuration
- Input validation with class-validator
- Helmet.js for security headers
- Rate limiting (can be added)
- CSRF protection

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Start the production server: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Set production environment variables

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:
- **Users**: Authentication and user management
- **Tenants**: Business/organization accounts
- **Reviews**: Video testimonials and metadata
- **Widgets**: Embeddable review displays
- **BillingAccounts**: Stripe integration and subscription management
- **VideoAssets/AudioAssets**: Media file metadata
- **AnalyticsEvents**: Usage tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email: support@truetestify.com

---

**TrueTestify** - Building trust through video testimonials, one face at a time.
