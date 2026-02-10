# 🛍️ PerryStore - Luxury E-Commerce Platform

A modern, full-stack e-commerce application built with Next.js 15, Firebase, and Paystack for the Ghanaian market. PerryStore offers a sophisticated shopping experience with real-time inventory management, secure payments, and comprehensive order tracking.

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🛒 Customer Features
- **Modern Shopping Experience**: Elegant product browsing with advanced filtering and search
- **Secure Checkout**: Multi-step checkout with form validation and address management
- **Multiple Payment Options**: 
  - Card payments (Visa, Mastercard)
  - Mobile Money (MTN, Vodafone)
  - Bank transfers via Paystack
- **Real-time Order Tracking**: Track orders from placement to delivery
- **User Authentication**: Email/password and phone number authentication
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Product Categories**: Easy navigation through organized product categories
- **Stock Indicators**: Real-time stock availability and low stock warnings

### 👨‍💼 Admin Features
- **Analytics Dashboard**: Real-time statistics and insights
  - Total orders and revenue
  - Today's orders
  - Status breakdown (pending, shipped, delivered)
- **Product Management**: 
  - Add, edit, and delete products
  - Image upload via ImageKit
  - Inventory tracking
- **Category Management**: Organize products into categories
- **Order Management**: 
  - View all orders with real-time updates
  - Update order status
  - Track payment status
  - View detailed customer information
- **Beautiful UI**: Clean, professional admin interface

### 🔒 Security Features
- **Form Validation**: Comprehensive input validation with Zod
- **Secure Payments**: 256-bit SSL encryption via Paystack
- **Admin Protection**: Middleware-based route protection
- **Input Sanitization**: Protection against malicious inputs
- **Error Boundaries**: Graceful error handling

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend & Services
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **File Storage**: ImageKit
- **Payment Gateway**: Paystack (Ghana)
- **Email**: Resend (configured)
- **SMS**: Wigal (optional, for Ghana)

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js 15)
- **Linting**: ESLint
- **AI Integration**: Google Genkit (product recommendations)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Firebase** account and project
- **Paystack** account (for Ghana)
- **ImageKit** account
- **Git** installed

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kingenious0/PerryClothStore.git
cd PerryClothStore
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Paystack (Ghana)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
IMAGEKIT_PRIVATE_KEY=your_private_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@perrystore.com

# SMS Service (Optional - Wigal)
WIGAL_API_KEY=your_wigal_api_key
WIGAL_SENDER_ID=PerryStore

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
ADMIN_EMAIL=admin@perrystore.com

# Google Gemini AI (for recommendations)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password and Phone)
4. Set up Firestore indexes (see `docs/FIRESTORE_INDEX_SETUP.md`)
5. Configure security rules (see `firestore.rules`)

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002)

## 📁 Project Structure

```
PerryClothStore/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (main)/            # Customer-facing pages
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── cart/              # Shopping cart
│   │   ├── shared/            # Reusable components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   ├── types/                 # TypeScript types
│   └── firebase/              # Firebase configuration
├── docs/                      # Documentation
├── public/                    # Static assets
└── .env                       # Environment variables
```

## 🎨 Key Pages

### Customer Pages
- `/` - Homepage with featured products
- `/shop` - Product catalog with filters
- `/product/[id]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - Order history
- `/orders/[id]` - Order tracking

### Admin Pages
- `/admin` - Dashboard with analytics
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management

## 🔧 Configuration

### Firestore Collections

The app uses these Firestore collections:
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `users` - User profiles (managed by Firebase Auth)

### Payment Flow

1. Customer completes checkout form
2. Order created in Firestore
3. Paystack payment initialized
4. Customer redirected to Paystack
5. Payment completed
6. Webhook updates order status
7. Customer redirected to success page

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Production
Make sure to add all environment variables in your hosting platform's dashboard.

### Pre-Deployment Checklist
- [ ] Switch Paystack to live keys
- [ ] Set up production Firebase rules
- [ ] Configure domain in Firebase Auth
- [ ] Set up Firestore indexes
- [ ] Add production URL to environment variables
- [ ] Test payment flow
- [ ] Enable error monitoring (Sentry, etc.)

## 📱 Screenshots

### Customer Experience
- Modern homepage with trust badges
- Advanced product filtering
- Secure checkout with multiple payment options
- Real-time order tracking

### Admin Dashboard
- Analytics and insights
- Product management interface
- Order management with real-time updates

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👤 Author

**Perry Store Team**

- GitHub: [@kingenious0](https://github.com/kingenious0)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Paystack](https://paystack.com/) - Payment Gateway
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [ImageKit](https://imagekit.io/) - Image Management

## 📞 Support

For support, email support@perrystore.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with AI
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Email marketing integration
- [ ] Loyalty program

---

**Built with ❤️ for the Ghanaian market**
