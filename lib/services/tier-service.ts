/**
 * Tier Service - Calculates influencer tier based on referral count
 */

export type InfluencerTier = 'Hustler' | 'Achiever' | 'Premium' | 'Platinum' | 'Diamond' | 'Exclusive Black';

export interface TierInfo {
  tier: InfluencerTier;
  commissionRate: number;
  minReferrals: number;
  maxReferrals: number | null; // null means no upper limit
}

export const INFLUENCER_TIERS: TierInfo[] = [
  {
    tier: 'Hustler',
    commissionRate: 2.5,
    minReferrals: 0,
    maxReferrals: 14,
  },
  {
    tier: 'Achiever',
    commissionRate: 5.0,
    minReferrals: 15,
    maxReferrals: 29,
  },
  {
    tier: 'Premium',
    commissionRate: 7.5,
    minReferrals: 30,
    maxReferrals: 49,
  },
  {
    tier: 'Platinum',
    commissionRate: 10.0,
    minReferrals: 50,
    maxReferrals: 99,
  },
  {
    tier: 'Diamond',
    commissionRate: 15.0,
    minReferrals: 100,
    maxReferrals: 119,
  },
  {
    tier: 'Exclusive Black',
    commissionRate: 20.0,
    minReferrals: 120,
    maxReferrals: null,
  },
];

/**
 * Calculate influencer tier based on total referrals
 */
export function calculateInfluencerTier(totalReferrals: number): TierInfo {
  // Find the highest tier the influencer qualifies for
  for (let i = INFLUENCER_TIERS.length - 1; i >= 0; i--) {
    const tier = INFLUENCER_TIERS[i];
    if (totalReferrals >= tier.minReferrals) {
      return tier;
    }
  }
  
  // Default to Hustler if no tier matches (shouldn't happen, but safety check)
  return INFLUENCER_TIERS[0];
}

/**
 * Get commission rate for influencer based on referral count
 */
export function getInfluencerCommissionRate(totalReferrals: number): number {
  const tierInfo = calculateInfluencerTier(totalReferrals);
  return tierInfo.commissionRate;
}

/**
 * Get next tier information
 */
export function getNextTier(currentTier: InfluencerTier): TierInfo | null {
  const currentIndex = INFLUENCER_TIERS.findIndex(t => t.tier === currentTier);
  if (currentIndex === -1 || currentIndex === INFLUENCER_TIERS.length - 1) {
    return null; // Already at highest tier or invalid tier
  }
  return INFLUENCER_TIERS[currentIndex + 1];
}

/**
 * Get progress toward next tier
 */
export function getTierProgress(totalReferrals: number, currentTier: InfluencerTier): {
  current: number;
  next: number | null;
  progress: number; // 0-100
} {
  const tierInfo = calculateInfluencerTier(totalReferrals);
  const nextTier = getNextTier(tierInfo.tier);
  
  if (!nextTier) {
    return {
      current: totalReferrals,
      next: null,
      progress: 100, // At max tier
    };
  }
  
  const progress = nextTier.minReferrals > tierInfo.minReferrals
    ? ((totalReferrals - tierInfo.minReferrals) / (nextTier.minReferrals - tierInfo.minReferrals)) * 100
    : 0;
  
  return {
    current: totalReferrals,
    next: nextTier.minReferrals,
    progress: Math.min(100, Math.max(0, progress)),
  };
}

/**
 * Get all tiers for display (timeline)
 */
export function getAllTiers(): TierInfo[] {
  return INFLUENCER_TIERS;
}

