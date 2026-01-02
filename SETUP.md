# LeetTracker - Google OAuth Setup Guide

## 🚀 Setup Instructions

### 1. Configure Google OAuth Credentials

You need to add your Google OAuth credentials to the `.env` file:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen if you haven't already
6. For Application type, select "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - Add your production URL when deploying
8. Copy the Client ID and Client Secret

### 2. Update Environment Variables

Open `.env` file and add your Google credentials:

```env
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

**Important:** The following variables are already configured:
- `DATABASE_URL` - PostgreSQL connection string (Neon DB)
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret for NextAuth.js

### 3. Database Setup

The database has already been migrated with the following command:
```bash
npx prisma migrate dev --name init
```

If you need to reset the database or run migrations again:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 Features Implemented

### ✅ Authentication
- **Google OAuth 2.0** integration using NextAuth.js
- **Session management** with database sessions (PostgreSQL)
- **Protected routes** using Next.js middleware
- **Automatic redirects** based on authentication status

### ✅ Pages
1. **Landing Page** (`/`)
   - Beautiful, modern UI with gradient backgrounds
   - Feature highlights
   - "Continue with Google" button
   - Auto-redirects to dashboard if already logged in

2. **Dashboard** (`/dashboard`)
   - Protected route (requires authentication)
   - User profile display with Google avatar
   - Statistics cards (ready for data integration)
   - Sign out functionality
   - Auto-redirects to landing page if not authenticated

### ✅ Database Schema
- **User** - Stores user information
- **Account** - OAuth account details
- **Session** - Active user sessions
- **VerificationToken** - Email verification tokens

## 🔒 Security Features

- **Middleware protection** on `/dashboard` routes
- **Database sessions** for better security
- **CSRF protection** built into NextAuth.js
- **Secure session tokens**

## 🎨 UI/UX Features

- **Responsive design** - Works on mobile, tablet, and desktop
- **Dark mode support** - Automatic theme detection
- **Modern gradients** - Beautiful color schemes
- **Smooth transitions** - Enhanced user experience
- **Loading states** - Proper feedback during authentication

## 📁 Project Structure

```
leet-tracker/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts          # NextAuth API route
│   ├── dashboard/
│   │   └── page.tsx           # Protected dashboard page
│   ├── generated/prisma/      # Generated Prisma client
│   ├── layout.tsx             # Root layout with SessionProvider
│   └── page.tsx               # Landing page with login
├── components/
│   └── providers/
│       └── SessionProvider.tsx # Client-side session provider
├── lib/
│   └── auth.ts                # NextAuth configuration
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── types/
│   └── next-auth.d.ts         # TypeScript definitions
├── middleware.ts              # Route protection
└── .env                       # Environment variables
```

## 🔄 Authentication Flow

1. User visits landing page (`/`)
2. Clicks "Continue with Google"
3. Redirected to Google OAuth consent screen
4. After approval, redirected back to `/api/auth/callback/google`
5. NextAuth creates user session in database
6. User redirected to `/dashboard`
7. Session persists across page reloads
8. Middleware protects dashboard routes

## 🛠️ Next Steps

1. **Add Google credentials** to `.env` file
2. **Test the authentication flow**
3. **Customize the dashboard** with your LeetCode tracking features
4. **Add more protected routes** as needed
5. **Deploy to production** (Vercel recommended)

## 📝 Notes

- The Prisma client is generated in `app/generated/prisma`
- Sessions are stored in the PostgreSQL database
- The middleware automatically protects all `/dashboard/*` routes
- TypeScript types are properly configured for NextAuth sessions

## 🐛 Troubleshooting

### "Cannot find module '@/app/generated/prisma'"
Run: `npx prisma generate`

### Google OAuth Error
- Verify redirect URIs in Google Cloud Console
- Check that credentials are correctly added to `.env`
- Ensure `NEXTAUTH_URL` matches your development URL

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Check Neon DB connection status
- Run `npx prisma migrate dev` to sync schema

## 🚀 Ready to Launch!

Once you add your Google OAuth credentials, you're ready to go! Just run `npm run dev` and visit `http://localhost:3000`.
