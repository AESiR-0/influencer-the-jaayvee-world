# Influencer Seed Data

This directory contains comprehensive seed data for the influencer-the-jaayvee-world project.

## 📊 Generated Data

The seed script creates realistic test data including:

- **5 Influencers** with different tiers (Silver, Gold, Platinum)
- **5 Campaigns** across various industries (Fashion, Tech, Fitness, Travel, Food)
- **5 Submissions** with different statuses (approved, pending, rejected)
- **5 Wallet Records** with transaction history
- **5 Referral Records** with earnings data
- **2 Analytics Records** with engagement metrics

## 🚀 Usage

### 1. Generate Seed Data
```bash
npm run seed
```

### 2. Import Data
The seed data is saved to `seed-data.json` and can be imported into your application:

```typescript
import seedData from './seed-data.json';

// Use the data in your application
const { influencers, campaigns, submissions, wallets, referrals, analytics } = seedData;
```

### 3. Firebase Integration
Create Firebase users with the provided credentials:

```typescript
// Example Firebase user creation
const influencer = seedData.influencers[0];
await createUserWithEmailAndPassword(auth, influencer.email, influencer.password);
```

## 🔐 Test Credentials

All test accounts use the same password for simplicity:

| Email | Password | Name | Tier | Followers |
|-------|----------|------|------|-----------|
| sarah.johnson@example.com | Password123! | Sarah Johnson | Gold | 25,000 |
| mike.chen@example.com | Password123! | Mike Chen | Platinum | 50,000 |
| emma.davis@example.com | Password123! | Emma Davis | Silver | 15,000 |
| alex.rivera@example.com | Password123! | Alex Rivera | Platinum | 75,000 |
| lisa.wang@example.com | Password123! | Lisa Wang | Gold | 30,000 |

## 📋 Data Structure

### Influencers
```typescript
{
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  followers: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  bio: string;
  socialMedia: {
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  categories: string[];
  location: string;
  isActive: boolean;
  createdAt: Date;
}
```

### Campaigns
```typescript
{
  id: string;
  title: string;
  description: string;
  brand: string;
  budget: number;
  requirements: string;
  targetAudience: string;
  deadline: Date;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  applications: number;
  selectedInfluencers: number;
}
```

### Submissions
```typescript
{
  id: string;
  influencerId: string;
  campaignId: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  screenshot: string;
  storyLink: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Wallets
```typescript
{
  influencerId: string;
  balance: number;
  totalEarned: number;
  pendingAmount: number;
  transactions: Array<{
    id: string;
    type: 'earning' | 'payout';
    amount: number;
    description: string;
    date: Date;
    status: 'completed' | 'pending';
  }>;
}
```

### Referrals
```typescript
{
  influencerId: string;
  code: string;
  link: string;
  venture: string;
  totalReferrals: number;
  totalEarnings: number;
  createdAt: Date;
}
```

### Analytics
```typescript
{
  influencerId: string;
  period: string;
  totalViews: number;
  totalEngagement: number;
  averageEngagementRate: number;
  topContent: Array<{
    platform: string;
    postId: string;
    views: number;
    engagement: number;
    engagementRate: number;
  }>;
  demographics: {
    ageGroups: Record<string, number>;
    gender: Record<string, number>;
    topLocations: string[];
  };
}
```

## 🎯 Use Cases

This seed data is perfect for:

- **Development Testing** - Test all features with realistic data
- **Demo Presentations** - Showcase the platform with diverse influencers
- **UI/UX Testing** - Verify layouts with different data sizes
- **Performance Testing** - Test with realistic data volumes
- **Feature Development** - Develop new features with existing data

## 🔄 Regenerating Data

To regenerate the seed data with fresh random values:

```bash
npm run seed
```

This will overwrite the existing `seed-data.json` file with new data.

## 📝 Customization

You can modify the seed script (`scripts/seed.ts`) to:

- Add more influencers or campaigns
- Change data patterns or values
- Add new data types
- Modify the data structure

## 🚨 Important Notes

- **Test Data Only**: This data is for development/testing purposes only
- **No Real Users**: All emails and phone numbers are fictional
- **Consistent Passwords**: All accounts use the same password for testing convenience
- **Realistic Values**: All numbers and dates are realistic but fictional

## 📞 Support

If you need help with the seed data or want to add new data types, please refer to the main project documentation or contact the development team.
