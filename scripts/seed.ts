import { writeFileSync } from 'fs';
import { join } from 'path';

// API configuration - using jaayvee-world API
const JAAYVEE_API_BASE_URL = process.env.JAAYVEE_API_BASE_URL || 'https://talaash.thejaayveeworld.com';

// Sample influencer data
const sampleInfluencers = [
  {
    id: 'inf-001',
    email: 'sarah.johnson@example.com',
    password: 'Password123!',
    fullName: 'Sarah Johnson',
    phone: '+1234567890',
    followers: 25000,
    tier: 'Gold',
    bio: 'Fashion & Lifestyle influencer with 25K followers. Passionate about sustainable fashion and beauty.',
    socialMedia: {
      instagram: '@sarahjohnson_fashion',
      tiktok: '@sarahjohnson',
      youtube: 'Sarah Johnson Fashion'
    },
    categories: ['Fashion', 'Beauty', 'Lifestyle'],
    location: 'New York, NY',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'inf-002',
    email: 'mike.chen@example.com',
    password: 'Password123!',
    fullName: 'Mike Chen',
    phone: '+1234567891',
    followers: 50000,
    tier: 'Platinum',
    bio: 'Tech reviewer and gadget enthusiast. Sharing the latest in technology and innovation.',
    socialMedia: {
      instagram: '@mikechen_tech',
      tiktok: '@mikechen',
      youtube: 'Mike Chen Tech'
    },
    categories: ['Technology', 'Gadgets', 'Reviews'],
    location: 'San Francisco, CA',
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'inf-003',
    email: 'emma.davis@example.com',
    password: 'Password123!',
    fullName: 'Emma Davis',
    phone: '+1234567892',
    followers: 15000,
    tier: 'Silver',
    bio: 'Fitness coach and wellness advocate. Helping people achieve their health goals.',
    socialMedia: {
      instagram: '@emmadavis_fitness',
      tiktok: '@emmadavis',
      youtube: 'Emma Davis Fitness'
    },
    categories: ['Fitness', 'Health', 'Wellness'],
    location: 'Los Angeles, CA',
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'inf-004',
    email: 'alex.rivera@example.com',
    password: 'Password123!',
    fullName: 'Alex Rivera',
    phone: '+1234567893',
    followers: 75000,
    tier: 'Platinum',
    bio: 'Travel blogger and adventure seeker. Exploring the world one destination at a time.',
    socialMedia: {
      instagram: '@alexrivera_travel',
      tiktok: '@alexrivera',
      youtube: 'Alex Rivera Travel'
    },
    categories: ['Travel', 'Adventure', 'Photography'],
    location: 'Miami, FL',
    isActive: true,
    createdAt: new Date('2024-02-10')
  },
  {
    id: 'inf-005',
    email: 'lisa.wang@example.com',
    password: 'Password123!',
    fullName: 'Lisa Wang',
    phone: '+1234567894',
    followers: 30000,
    tier: 'Gold',
    bio: 'Food blogger and culinary expert. Sharing delicious recipes and restaurant reviews.',
    socialMedia: {
      instagram: '@lisawang_food',
      tiktok: '@lisawang',
      youtube: 'Lisa Wang Food'
    },
    categories: ['Food', 'Cooking', 'Restaurants'],
    location: 'Chicago, IL',
    isActive: true,
    createdAt: new Date('2024-02-15')
  }
];

// Sample campaign data
const sampleCampaigns = [
  {
    id: 'camp-001',
    title: 'Summer Fashion Collection 2024',
    description: 'Promote our new summer fashion line with authentic lifestyle content',
    brand: 'Fashion Forward Co.',
    budget: 5000,
    requirements: 'Post 3 Instagram posts, 2 TikTok videos, 1 YouTube review',
    targetAudience: 'Fashion enthusiasts, 18-35 years old',
    deadline: new Date('2024-08-15'),
    status: 'active',
    createdAt: new Date('2024-07-01'),
    applications: 12,
    selectedInfluencers: 3
  },
  {
    id: 'camp-002',
    title: 'Tech Gadget Launch',
    description: 'Review and showcase our latest smartphone with detailed unboxing',
    brand: 'Tech Innovations Inc.',
    budget: 8000,
    requirements: 'Unboxing video, detailed review, social media posts',
    targetAudience: 'Tech enthusiasts, early adopters',
    deadline: new Date('2024-09-01'),
    status: 'active',
    createdAt: new Date('2024-07-05'),
    applications: 8,
    selectedInfluencers: 2
  },
  {
    id: 'camp-003',
    title: 'Fitness Apparel Campaign',
    description: 'Promote our new athletic wear line with workout content',
    brand: 'FitLife Brand',
    budget: 3000,
    requirements: 'Workout videos, before/after photos, testimonial',
    targetAudience: 'Fitness enthusiasts, gym-goers',
    deadline: new Date('2024-07-30'),
    status: 'active',
    createdAt: new Date('2024-07-10'),
    applications: 15,
    selectedInfluencers: 4
  },
  {
    id: 'camp-004',
    title: 'Travel Destination Promotion',
    description: 'Showcase beautiful destinations and travel experiences',
    brand: 'Wanderlust Travel',
    budget: 6000,
    requirements: 'Travel vlogs, destination photos, itinerary sharing',
    targetAudience: 'Travel enthusiasts, adventure seekers',
    deadline: new Date('2024-08-30'),
    status: 'active',
    createdAt: new Date('2024-07-12'),
    applications: 10,
    selectedInfluencers: 2
  },
  {
    id: 'camp-005',
    title: 'Food & Restaurant Review',
    description: 'Review local restaurants and food experiences',
    brand: 'Culinary Adventures',
    budget: 2500,
    requirements: 'Restaurant visits, food photography, honest reviews',
    targetAudience: 'Food lovers, local community',
    deadline: new Date('2024-08-15'),
    status: 'active',
    createdAt: new Date('2024-07-15'),
    applications: 18,
    selectedInfluencers: 5
  }
];

// Sample submission data
const sampleSubmissions = [
  {
    id: 'sub-001',
    influencerId: 'inf-001',
    campaignId: 'camp-001',
    amount: 500,
    status: 'approved',
    screenshot: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    storyLink: 'https://instagram.com/p/summer-fashion-post-1',
    description: 'Posted 3 Instagram posts showcasing the summer collection with authentic lifestyle content',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-02')
  },
  {
    id: 'sub-002',
    influencerId: 'inf-002',
    campaignId: 'camp-002',
    amount: 800,
    status: 'pending',
    screenshot: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    storyLink: 'https://youtube.com/watch?v=tech-gadget-review',
    description: 'Created detailed unboxing and review video with comprehensive analysis',
    createdAt: new Date('2024-07-02'),
    updatedAt: new Date('2024-07-02')
  },
  {
    id: 'sub-003',
    influencerId: 'inf-003',
    campaignId: 'camp-003',
    amount: 300,
    status: 'rejected',
    screenshot: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    storyLink: 'https://tiktok.com/@emmadavis/video/fitness-workout',
    description: 'Workout video showcasing the apparel but missing brand visibility',
    createdAt: new Date('2024-07-03'),
    updatedAt: new Date('2024-07-04')
  },
  {
    id: 'sub-004',
    influencerId: 'inf-004',
    campaignId: 'camp-004',
    amount: 600,
    status: 'approved',
    screenshot: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    storyLink: 'https://instagram.com/p/travel-destination-vlog',
    description: 'Beautiful travel vlog showcasing destination with engaging storytelling',
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-06')
  },
  {
    id: 'sub-005',
    influencerId: 'inf-005',
    campaignId: 'camp-005',
    amount: 250,
    status: 'pending',
    screenshot: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    storyLink: 'https://instagram.com/p/restaurant-review-food',
    description: 'Comprehensive restaurant review with food photography and honest feedback',
    createdAt: new Date('2024-07-08'),
    updatedAt: new Date('2024-07-08')
  }
];

// Sample wallet data
const sampleWallets = [
  {
    influencerId: 'inf-001',
    balance: 1250.50,
    totalEarned: 3500.00,
    pendingAmount: 500.00,
    transactions: [
      {
        id: 'tx-001-1',
        type: 'earning',
        amount: 500.00,
        description: 'Summer Fashion Campaign completion',
        date: new Date('2024-07-02'),
        status: 'completed'
      },
      {
        id: 'tx-001-2',
        type: 'payout',
        amount: -300.00,
        description: 'Monthly payout',
        date: new Date('2024-06-30'),
        status: 'completed'
      },
      {
        id: 'tx-001-3',
        type: 'earning',
        amount: 250.00,
        description: 'Beauty Product Review',
        date: new Date('2024-06-25'),
        status: 'completed'
      }
    ]
  },
  {
    influencerId: 'inf-002',
    balance: 2100.75,
    totalEarned: 5200.00,
    pendingAmount: 800.00,
    transactions: [
      {
        id: 'tx-002-1',
        type: 'earning',
        amount: 800.00,
        description: 'Tech Gadget Review (Pending)',
        date: new Date('2024-07-02'),
        status: 'pending'
      },
      {
        id: 'tx-002-2',
        type: 'payout',
        amount: -500.00,
        description: 'Monthly payout',
        date: new Date('2024-06-30'),
        status: 'completed'
      },
      {
        id: 'tx-002-3',
        type: 'earning',
        amount: 400.00,
        description: 'Smartphone Unboxing',
        date: new Date('2024-06-20'),
        status: 'completed'
      }
    ]
  },
  {
    influencerId: 'inf-003',
    balance: 450.25,
    totalEarned: 1200.00,
    pendingAmount: 0.00,
    transactions: [
      {
        id: 'tx-003-1',
        type: 'earning',
        amount: 200.00,
        description: 'Fitness Apparel Campaign',
        date: new Date('2024-06-15'),
        status: 'completed'
      },
      {
        id: 'tx-003-2',
        type: 'payout',
        amount: -150.00,
        description: 'Monthly payout',
        date: new Date('2024-06-30'),
        status: 'completed'
      }
    ]
  },
  {
    influencerId: 'inf-004',
    balance: 3200.00,
    totalEarned: 7800.00,
    pendingAmount: 600.00,
    transactions: [
      {
        id: 'tx-004-1',
        type: 'earning',
        amount: 600.00,
        description: 'Travel Destination Campaign',
        date: new Date('2024-07-06'),
        status: 'completed'
      },
      {
        id: 'tx-004-2',
        type: 'payout',
        amount: -800.00,
        description: 'Monthly payout',
        date: new Date('2024-06-30'),
        status: 'completed'
      },
      {
        id: 'tx-004-3',
        type: 'earning',
        amount: 500.00,
        description: 'Adventure Gear Review',
        date: new Date('2024-06-10'),
        status: 'completed'
      }
    ]
  },
  {
    influencerId: 'inf-005',
    balance: 1800.50,
    totalEarned: 2800.00,
    pendingAmount: 250.00,
    transactions: [
      {
        id: 'tx-005-1',
        type: 'earning',
        amount: 250.00,
        description: 'Restaurant Review Campaign (Pending)',
        date: new Date('2024-07-08'),
        status: 'pending'
      },
      {
        id: 'tx-005-2',
        type: 'payout',
        amount: -200.00,
        description: 'Monthly payout',
        date: new Date('2024-06-30'),
        status: 'completed'
      },
      {
        id: 'tx-005-3',
        type: 'earning',
        amount: 300.00,
        description: 'Food Product Review',
        date: new Date('2024-06-18'),
        status: 'completed'
      }
    ]
  }
];

// Sample referral data
const sampleReferrals = [
  {
    influencerId: 'inf-001',
    code: 'INF001',
    link: 'https://jaayvee.com/influencer?ref=inf-001',
    venture: 'Jaayvee World',
    totalReferrals: 8,
    totalEarnings: 240.00,
    createdAt: new Date('2024-01-15')
  },
  {
    influencerId: 'inf-002',
    code: 'INF002',
    link: 'https://jaayvee.com/influencer?ref=inf-002',
    venture: 'Jaayvee World',
    totalReferrals: 15,
    totalEarnings: 450.00,
    createdAt: new Date('2024-01-20')
  },
  {
    influencerId: 'inf-003',
    code: 'INF003',
    link: 'https://jaayvee.com/influencer?ref=inf-003',
    venture: 'Jaayvee World',
    totalReferrals: 5,
    totalEarnings: 150.00,
    createdAt: new Date('2024-02-01')
  },
  {
    influencerId: 'inf-004',
    code: 'INF004',
    link: 'https://jaayvee.com/influencer?ref=inf-004',
    venture: 'Jaayvee World',
    totalReferrals: 12,
    totalEarnings: 360.00,
    createdAt: new Date('2024-02-10')
  },
  {
    influencerId: 'inf-005',
    code: 'INF005',
    link: 'https://jaayvee.com/influencer?ref=inf-005',
    venture: 'Jaayvee World',
    totalReferrals: 7,
    totalEarnings: 210.00,
    createdAt: new Date('2024-02-15')
  }
];

// Sample analytics data
const sampleAnalytics = [
  {
    influencerId: 'inf-001',
    period: '30_days',
    totalViews: 125000,
    totalEngagement: 8500,
    averageEngagementRate: 6.8,
    topContent: [
      {
        platform: 'Instagram',
        postId: 'summer-fashion-post-1',
        views: 45000,
        engagement: 3200,
        engagementRate: 7.1
      },
      {
        platform: 'TikTok',
        postId: 'fashion-trend-video',
        views: 80000,
        engagement: 5300,
        engagementRate: 6.6
      }
    ],
    demographics: {
      ageGroups: {
        '18-24': 35,
        '25-34': 45,
        '35-44': 15,
        '45+': 5
      },
      gender: {
        female: 78,
        male: 22
      },
      topLocations: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
    }
  },
  {
    influencerId: 'inf-002',
    period: '30_days',
    totalViews: 280000,
    totalEngagement: 19500,
    averageEngagementRate: 7.0,
    topContent: [
      {
        platform: 'YouTube',
        postId: 'tech-gadget-review',
        views: 150000,
        engagement: 12000,
        engagementRate: 8.0
      },
      {
        platform: 'Instagram',
        postId: 'tech-unboxing',
        views: 130000,
        engagement: 7500,
        engagementRate: 5.8
      }
    ],
    demographics: {
      ageGroups: {
        '18-24': 25,
        '25-34': 50,
        '35-44': 20,
        '45+': 5
      },
      gender: {
        female: 35,
        male: 65
      },
      topLocations: ['San Francisco', 'Seattle', 'Austin', 'Boston', 'Denver']
    }
  }
];

// Main seed data object
const seedData = {
  influencers: sampleInfluencers,
  campaigns: sampleCampaigns,
  submissions: sampleSubmissions,
  wallets: sampleWallets,
  referrals: sampleReferrals,
  analytics: sampleAnalytics,
  metadata: {
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    description: 'Sample data for influencer-the-jaayvee-world project',
    totalRecords: {
      influencers: sampleInfluencers.length,
      campaigns: sampleCampaigns.length,
      submissions: sampleSubmissions.length,
      wallets: sampleWallets.length,
      referrals: sampleReferrals.length,
      analytics: sampleAnalytics.length
    }
  }
};

// Function to register influencers via jaayvee-world API
async function registerInfluencers() {
  console.log('🔐 Registering influencers via jaayvee-world API...');
  
  const results = [];
  
  for (const influencer of seedData.influencers) {
    try {
      console.log(`📝 Registering: ${influencer.fullName} (${influencer.email})`);
      
      const response = await fetch(`${JAAYVEE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: influencer.email,
          password: influencer.password,
          fullName: influencer.fullName,
          phone: influencer.phone,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Registered: ${influencer.fullName} (${influencer.email})`);
        console.log(`   User ID: ${data.data.user.id}`);
        console.log(`   Role: ${data.data.user.role}`);
        results.push({
          success: true,
          influencer,
          userData: data.data.user,
        });
      } else {
        console.log(`⚠️ Failed: ${influencer.fullName} - ${data.error}`);
        results.push({
          success: false,
          influencer,
          error: data.error,
        });
      }
    } catch (error) {
      console.error(`❌ Error registering ${influencer.fullName}:`, error);
      results.push({
        success: false,
        influencer,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  return results;
}

// Function to save seed data
function saveSeedData() {
  try {
    const outputPath = join(process.cwd(), 'seed-data.json');
    writeFileSync(outputPath, JSON.stringify(seedData, null, 2));
    console.log('✅ Seed data saved to seed-data.json');
    return true;
  } catch (error) {
    console.error('❌ Failed to save seed data:', error);
    return false;
  }
}

// Function to display summary
function displaySummary() {
  console.log('\n🌱 Influencer Seed Data Generated Successfully!');
  console.log('='.repeat(50));
  console.log(`👥 Influencers: ${seedData.influencers.length}`);
  console.log(`🎯 Campaigns: ${seedData.campaigns.length}`);
  console.log(`📝 Submissions: ${seedData.submissions.length}`);
  console.log(`💰 Wallet Records: ${seedData.wallets.length}`);
  console.log(`🔗 Referral Records: ${seedData.referrals.length}`);
  console.log(`📊 Analytics Records: ${seedData.analytics.length}`);
  console.log('='.repeat(50));
  
  console.log('\n📋 Sample Influencers:');
  seedData.influencers.forEach((inf, index) => {
    console.log(`   ${index + 1}. ${inf.fullName} (${inf.tier}) - ${inf.followers.toLocaleString()} followers`);
  });
  
  console.log('\n🎯 Sample Campaigns:');
  seedData.campaigns.forEach((camp, index) => {
    console.log(`   ${index + 1}. ${camp.title} - $${camp.budget.toLocaleString()} budget`);
  });
  
  console.log('\n💡 Usage Instructions:');
  console.log('   1. Import seed-data.json in your application');
  console.log('   2. Use the data to populate your database');
  console.log('   3. Create Firebase users with the provided credentials');
  console.log('   4. Test your application with realistic data');
  
  console.log('\n🔐 Test Credentials:');
  console.log('   Email: sarah.johnson@example.com');
  console.log('   Password: Password123!');
  console.log('   (All test accounts use the same password)');
}

// Main execution
async function main() {
  console.log('🚀 Starting influencer seed data generation...');
  
  // Save seed data to JSON file
  const saved = saveSeedData();
  
  if (saved) {
    displaySummary();
    
    // Register influencers via jaayvee-world API
    console.log('\n🔐 Registering influencers via jaayvee-world API...');
    console.log(`📡 API URL: ${JAAYVEE_API_BASE_URL}/api/auth/register`);
    const registrationResults = await registerInfluencers();
    
    // Display registration summary
    const successful = registrationResults.filter(r => r.success).length;
    const failed = registrationResults.filter(r => !r.success).length;
    
    console.log('\n📊 Registration Summary:');
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('\n⚠️ Failed Registrations:');
      registrationResults
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`   - ${r.influencer.fullName}: ${r.error}`);
        });
    }
    
    // Save registration results
    const resultsPath = join(process.cwd(), 'registration-results.json');
    writeFileSync(resultsPath, JSON.stringify(registrationResults, null, 2));
    console.log('\n💾 Registration results saved to registration-results.json');
    
    console.log('\n✨ Seed data generation and registration completed!');
  } else {
    console.log('\n💥 Seed data generation failed!');
    process.exit(1);
  }
}

// Run the seed script
main();

export { seedData, saveSeedData, displaySummary };