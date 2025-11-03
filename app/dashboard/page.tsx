"use client";

import { Clock, DollarSign, Share2, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { api } from "@/lib/api";
import { authUtils } from "@/lib/auth-utils";
import { UpdatesPanel } from "@/components/UpdatesPanel";

interface Profile {
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
  totalEarnings: string;
}

interface Referral {
  id: string;
  code: string;
  link: string;
  ventureId: string;
  clicks: number;
  conversions: number;
  isActive: boolean;
  createdAt: string;
}

interface Submission {
  id: string;
  screenshot: string;
  storyLink: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface DashboardData {
  profile: Profile;
  influencerProfile: InfluencerProfile | null;
  referrals: Referral[];
  submissions: Submission[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const user = authUtils.getUser();
        const influencerProfile = authUtils.getProfile();
        const isAdmin = authUtils.isAdmin();
        
        if (!user) {
          router.push("/login");
          return;
        }

        // Admins can access dashboard even without influencer profile
        if (!influencerProfile && !isAdmin) {
          router.push("/login");
          return;
        }

        // For users without influencer profile (including admins), show empty data but same structure
        if (!influencerProfile) {
          const dashboardData: DashboardData = {
            profile: user,
            influencerProfile: null,
            referrals: [],
            submissions: []
          };
          setData(dashboardData);
          return;
        }

        // Fetch real data from API for users with influencer profiles
        const [referralsResponse, submissionsResponse] = await Promise.all([
          api.getReferral(influencerProfile.id),
          api.getSubmissions(influencerProfile.id)
        ]);

        const dashboardData: DashboardData = {
          profile: user,
          influencerProfile: influencerProfile,
          referrals: referralsResponse.data || [],
          submissions: submissionsResponse.data || []
        };

        setData(dashboardData);
      } catch (error: any) {
        console.error("Failed to load dashboard data:", error);
        setError(error.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error || "Failed to load data"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const { profile, influencerProfile, referrals, submissions } = data;

  // Calculate stats (handle null influencerProfile)
  const totalEarnings = influencerProfile ? parseFloat(influencerProfile.totalEarnings) || 0 : 0;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="container max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fg mb-2">Dashboard</h1>
          <p className="text-muted">
            Welcome back, {profile?.fullName || "User"}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value={`₹${totalEarnings}`}
            description="Earned from approved posts"
            tooltip="Total = Cashback earnings + Referral earnings"
            icon={<DollarSign className="h-4 w-4 text-accent" />}
          />
          <StatCard
            title="Pending Approvals"
            value={pendingCount}
            description="Awaiting review"
            icon={<Clock className="h-4 w-4 text-accent" />}
          />
          <StatCard
            title="Posts Shared"
            value={approvedCount}
            description="Successfully approved"
            icon={<Share2 className="h-4 w-4 text-accent" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                Your Partner Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {influencerProfile?.referralCode ? (
                <div className="space-y-4">
                  <div className="p-3 bg-accent-light rounded-xl">
                    <code className="text-accent font-mono text-lg">
                      {influencerProfile.referralCode}
                    </code>
                  </div>
                  <Button
                    onClick={() =>
                      router.push(`/campaigns`)
                    }
                    className="w-full"
                  >
                    Share Referral Code
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-4">
                    No referral code generated yet
                  </p>
                  <Button onClick={() => router.push("/campaigns")}>
                    Generate Referral Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Updates Panel */}
        <div className="mb-8">
          <UpdatesPanel 
            audience="influencer" 
            apiBaseUrl="https://thejaayveeworld.com"
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.slice(0, 3).map((submission, index) => (
                  <div
                    key={submission.id || `submission-${index}`}
                    className="flex items-center justify-between p-4 border border-border rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-fg">
                        Submission #{submission.id || index + 1}
                      </p>
                      <p className="text-sm text-muted">
                        Amount: ₹{submission.amount || "0"} •{" "}
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : submission.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {submission.status || "pending"}
                    </span>
                  </div>
                ))}
                {submissions.length > 3 && (
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/submissions")}
                    className="w-full"
                  >
                    View All Submissions
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted mb-4">No submissions yet</p>
                <Button onClick={() => router.push("/submissions")}>
                  Upload Your First Proof
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
