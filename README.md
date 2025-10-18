# The Jaayvee World - Influencers Dashboard

A comprehensive dashboard for influencers to manage their campaigns, track earnings, and upload proof of posts for cashback approval.

## Features

- 🔐 **Firebase Authentication** - OTP and email/password login
- 📊 **Dashboard Overview** - Track earnings, pending approvals, and posts shared
- 🔗 **Referral Management** - Generate and manage referral codes/links
- 📤 **Proof Upload** - Upload screenshots and story links for cashback approval
- 👤 **Profile Management** - View influencer info, tier, and wallet balance
- 💰 **Wallet Integration** - Connect to shared Jaayvee wallet

## Tech Stack

- **Next.js 15** with App Router
- **TailwindCSS** with custom Jaayvee theme
- **Firebase Auth** for authentication
- **Firebase Storage** for file uploads
- **Shadcn UI** components
- **TypeScript** for type safety

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_API_BASE_URL=https://talaash.thejaayveeworld.com/api
```

### 2. Firebase Configuration

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Phone providers
3. Enable Storage for file uploads
4. Add your domain to authorized domains
5. Copy the configuration values to your `.env.local` file

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Integration

The app connects to the backend APIs at `https://talaash.thejaayveeworld.com/api`:

- **Authentication**: `/api/influencers/auth/verify-token`
- **Profile**: `/api/influencers/profile?userId=`
- **Referrals**: `/api/influencers/referral?influencerId=`
- **Submissions**: `/api/influencers/submissions`
- **Wallet**: `/api/shared/wallets?userId=`

All requests include Firebase ID tokens in the Authorization header.

## Theme Colors

The app uses the Jaayvee brand colors:

- **Background**: #FFFFFF
- **Foreground**: #0C0C0C
- **Accent**: #00719C
- **Accent Light**: #E8F6FA
- **Border**: #E0E0E0

## Pages

- `/login` - Firebase authentication (OTP or email)
- `/dashboard` - Overview with stats and quick actions
- `/campaigns` - Manage referral codes and links
- `/submissions` - Upload proof and view submission history
- `/profile` - Influencer profile and wallet information

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

The app is designed to be deployed at `https://influencers.thejaayveeworld.com`.

Make sure to:
1. Set up Firebase project with proper domain configuration
2. Configure environment variables in your deployment platform
3. Set up proper CORS policies for API access
4. Configure Firebase Storage rules for file uploads

## Support

For support or questions, contact the development team.