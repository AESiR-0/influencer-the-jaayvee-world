"use client";

import { X, Award, CheckCircle2 } from "lucide-react";
import { InfluencerTier, INFLUENCER_TIERS } from "@/lib/services/tier-service";

interface TierTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: InfluencerTier;
  currentReferrals: number;
}

export default function TierTimelineModal({
  isOpen,
  onClose,
  currentTier,
  currentReferrals,
}: TierTimelineModalProps) {
  if (!isOpen) return null;

  const getTierColor = (tier: InfluencerTier) => {
    const colors: Record<InfluencerTier, string> = {
      'Hustler': 'from-gray-400 to-gray-600',
      'Achiever': 'from-blue-400 to-blue-600',
      'Premium': 'from-purple-400 to-purple-600',
      'Platinum': 'from-silver-400 to-silver-600',
      'Diamond': 'from-cyan-400 to-cyan-600',
      'Exclusive Black': 'from-black to-gray-900',
    };
    return colors[tier] || 'from-gray-400 to-gray-600';
  };

  const isTierReached = (tier: InfluencerTier) => {
    const tierInfo = INFLUENCER_TIERS.find(t => t.tier === tier);
    if (!tierInfo) return false;
    return currentReferrals >= tierInfo.minReferrals;
  };

  const isCurrentTier = (tier: InfluencerTier) => {
    return tier === currentTier;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Influencer Tier System</h2>
            <p className="text-purple-100 text-sm mt-1">Your current tier: <span className="font-semibold">{currentTier}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {INFLUENCER_TIERS.map((tierInfo, index) => {
            const reached = isTierReached(tierInfo.tier);
            const isCurrent = isCurrentTier(tierInfo.tier);
            const isNext = !reached && index > 0 && isTierReached(INFLUENCER_TIERS[index - 1].tier);

            return (
              <div
                key={tierInfo.tier}
                className={`relative p-5 rounded-xl border-2 transition-all ${
                  isCurrent
                    ? `border-purple-500 bg-gradient-to-r ${getTierColor(tierInfo.tier)} text-white shadow-lg scale-105`
                    : reached
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {/* Tier Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCurrent ? 'bg-white/20' : reached ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      <Award className={`h-6 w-6 ${
                        isCurrent ? 'text-white' : reached ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        isCurrent ? 'text-white' : reached ? 'text-green-900' : 'text-gray-700'
                      }`}>
                        {tierInfo.tier}
                        {isCurrent && (
                          <span className="ml-2 text-sm font-normal opacity-90">(Current)</span>
                        )}
                      </h3>
                      <p className={`text-sm ${
                        isCurrent ? 'text-white/90' : reached ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {tierInfo.commissionRate}% Commission Rate
                      </p>
                    </div>
                  </div>
                  {reached && (
                    <CheckCircle2 className={`h-6 w-6 ${
                      isCurrent ? 'text-white' : 'text-green-600'
                    }`} />
                  )}
                </div>

                {/* Requirements */}
                <div className={`mt-3 p-3 rounded-lg ${
                  isCurrent ? 'bg-white/20' : reached ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-white' : reached ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    Requirements: {tierInfo.minReferrals} - {tierInfo.maxReferrals === null ? '∞' : tierInfo.maxReferrals} referrals
                  </p>
                  {isNext && (
                    <p className="text-xs text-purple-600 mt-1 font-semibold">
                      🎯 Next tier to unlock!
                    </p>
                  )}
                </div>

                {/* Progress indicator */}
                {!reached && index > 0 && (
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, ((currentReferrals - INFLUENCER_TIERS[index - 1].minReferrals) / (tierInfo.minReferrals - INFLUENCER_TIERS[index - 1].minReferrals)) * 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentReferrals} / {tierInfo.minReferrals} referrals
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

