"use client";

import { Clock, DollarSign, Share2, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebaseClient";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

interface Profile {
  handle?: string;
  email?: string;
  followers?: number;
  tier?: string;
}

interface Referral {
  code?: string;
  link?: string;
  venture?: string;
  createdAt?: string;
}

interface Submission {
  id?: string;
  amount?: number;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

interface Wallet {
  balance?: number;
  totalEarned?: number;
  pendingAmount?: number;
}

interface DashboardData {
  profile: Profile;
  referral: Referral;
  submissions: Submission[];
  wallet: Wallet;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!auth || !auth.currentUser) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const userId = auth.currentUser.uid;

        const [profile, referral, submissions, wallet] = await Promise.all([
          api.getProfile(userId),
          api.getReferral(userId),
          api.getSubmissions(userId),
          api.getWallet(userId),
        ]);

        setData({ profile, referral, submissions, wallet });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError("Failed to load dashboard data");
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

  const { profile, referral, submissions, wallet } = data;

  // Calculate stats
  const totalCashback = submissions
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter(
    (s) => s.status === "approved",
  ).length;

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fg mb-2">Dashboard</h1>
          <p className="text-muted">
            Welcome back, {profile?.handle || "Influencer"}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Cashback"
            value={`₹${totalCashback.toLocaleString()}`}
            description="Earned from approved posts"
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
                Your Referral Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {referral?.code ? (
                <div className="space-y-4">
                  <div className="p-3 bg-accent-light rounded-xl">
                    <code className="text-accent font-mono text-lg">
                      {referral.code}
                    </code>
                  </div>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(referral.code || "")
                    }
                    className="w-full"
                  >
                    Copy Referral Code
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

          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-fg mb-2">
                  ₹{wallet?.balance?.toLocaleString() || "0"}
                </div>
                <p className="text-muted mb-4">Available balance</p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/profile")}
                >
                  View Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
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
                        {submission.createdAt || "Recently"}
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
