"use client";

import { Copy, ExternalLink, Star, User, Users, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { api } from "@/lib/api";
import { authUtils } from "@/lib/auth-utils";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

interface ProfileData {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  roleLevel: number;
}

interface InfluencerProfile {
  id: string;
  referralCode: string;
  tier: string;
  instagramHandle?: string;
  youtubeHandle?: string;
  followersCount: number;
  totalEarnings: string;
}

interface WalletData {
  balance: number;
  totalEarned: number;
  pendingAmount: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [influencerProfile, setInfluencerProfile] = useState<InfluencerProfile | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = authUtils.getUser();
      const influencer = authUtils.getProfile() as InfluencerProfile;
      
      if (!user || !influencer) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        
        // Get wallet data (if available)
        try {
          const walletData = await api.getWallet(user.id);
          setWallet(walletData.data || { balance: 0, totalEarned: 0, pendingAmount: 0 });
        } catch (error) {
          console.log("Wallet API not available, using default values");
          setWallet({ balance: 0, totalEarned: 0, pendingAmount: 0 });
        }

        setProfile(user);
        setInfluencerProfile(influencer);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "bronze":
        return "bg-amber-100 text-amber-800";
      case "silver":
        return "bg-gray-100 text-gray-800";
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-accent-light text-accent";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "bronze":
        return "🥉";
      case "silver":
        return "🥈";
      case "gold":
        return "🥇";
      case "platinum":
        return "💎";
      default:
        return "⭐";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-bg">
      <Header />

      <main className="container max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fg mb-2">Profile</h1>
          <p className="text-muted">
            Manage your influencer account and wallet
          </p>
        </div>

        <div className="grid grid-cols-1  gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-accent" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-fg">
                      {profile?.fullName || "Influencer"}
                    </h3>
                    <p className="text-muted">{profile?.email}</p>
                    {profile?.phone && (
                      <p className="text-sm text-muted">{profile.phone}</p>
                    )}
                    {influencerProfile?.instagramHandle && (
                      <p className="text-sm text-muted">{influencerProfile.instagramHandle}</p>
                    )}
                    {influencerProfile?.youtubeHandle && (
                      <p className="text-sm text-muted">{influencerProfile.youtubeHandle}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-accent-light rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-fg">
                        Followers
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-accent">
                      {influencerProfile?.followersCount?.toLocaleString() || "0"}
                    </p>
                  </div>

                  <div className="p-4 bg-accent-light rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-fg">Tier</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getTierIcon(influencerProfile?.tier || "")}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(influencerProfile?.tier || "")}`}
                      >
                        {influencerProfile?.tier || "Bronze"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted">
                    <strong>Referral Code:</strong> {influencerProfile?.referralCode || "N/A"}
                  </p>
                  <p className="text-sm text-muted">
                    <strong>Total Earnings:</strong> ₹{parseFloat(influencerProfile?.totalEarnings || "0").toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tier Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Tier Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm text-fg">
                      Higher cashback rates for higher tiers
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm text-fg">
                      Priority support and faster approvals
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm text-fg">
                      Exclusive campaigns and early access
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm text-fg">
                      Special badges and recognition
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-accent-light rounded-lg">
                  <p className="text-sm text-accent">
                    <strong>Next Tier:</strong> Keep growing your followers to
                    unlock higher tiers and better benefits!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

       
        </div>
      </main>
    </div>
  );
}
