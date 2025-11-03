"use client";

import { Clock, DollarSign, Share2, TrendingUp, Calendar, Users } from "lucide-react";
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
  adminEvents?: Array<{
    id: string;
    title: string;
    slug?: string;
    startDate: string;
    venue?: any;
  }>;
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

        // For admins without influencer profile, fetch events data
        if (isAdmin && !influencerProfile) {
          try {
            const eventsResponse = await api.getEvents();
            const upcomingEvents = [
              ...(eventsResponse.data?.summary?.recentEvents || []),
              ...(eventsResponse.data?.summary?.upcomingEvents || [])
            ];
            const dashboardData: DashboardData = {
              profile: user,
              influencerProfile: null,
              referrals: [],
              submissions: [],
              adminEvents: upcomingEvents
            };
            setData(dashboardData);
          } catch (err) {
            console.error("Failed to fetch events:", err);
            const dashboardData: DashboardData = {
              profile: user,
              influencerProfile: null,
              referrals: [],
              submissions: [],
              adminEvents: []
            };
            setData(dashboardData);
          }
          return;
        }

        // Fetch real data from API (only if influencer profile exists)
        const [referralsResponse, submissionsResponse] = await Promise.all([
          api.getReferral(influencerProfile!.id),
          api.getSubmissions(influencerProfile!.id)
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

  const { profile, influencerProfile, referrals, submissions, adminEvents } = data;
  const isAdmin = authUtils.isAdmin();

  // Calculate stats (handle null influencerProfile for admins)
  const totalEarnings = influencerProfile ? parseFloat(influencerProfile.totalEarnings) || 0 : 0;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  
  // Format venue for display
  const formatVenue = (venue: any): string => {
    if (!venue) return 'TBA';
    if (typeof venue === 'string') return venue;
    if (typeof venue === 'object') {
      const parts = [];
      if (venue.name) parts.push(venue.name);
      if (venue.city) parts.push(venue.city);
      if (venue.state) parts.push(venue.state);
      return parts.length > 0 ? parts.join(', ') : 'TBA';
    }
    return 'TBA';
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="container max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fg mb-2">Dashboard</h1>
          <p className="text-muted">
            Welcome back, {profile?.fullName || "User"}!
            {isAdmin && !influencerProfile && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Admin Mode
              </span>
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isAdmin && !influencerProfile ? (
            <>
              <StatCard
                title="Upcoming Events"
                value={adminEvents?.length || 0}
                description="Events available"
                icon={<Calendar className="h-4 w-4 text-accent" />}
              />
              <StatCard
                title="Total Events"
                value={adminEvents?.length || 0}
                description="All events"
                icon={<Share2 className="h-4 w-4 text-accent" />}
              />
              <StatCard
                title="Admin Access"
                value="Full"
                description="Full platform access"
                icon={<Users className="h-4 w-4 text-accent" />}
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Quick Actions / Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {isAdmin && !influencerProfile ? (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-accent" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adminEvents && adminEvents.length > 0 ? (
                  <div className="space-y-4">
                    {adminEvents.slice(0, 5).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-bg/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-fg mb-1">{event.title}</h3>
                          <div className="text-sm text-muted space-y-1">
                            <div>
                              📅 {new Date(event.startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {event.venue && (
                              <div>📍 {formatVenue(event.venue)}</div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            if (event.slug) {
                              window.open(`https://talaash.thejaayveeworld.com/events/${event.slug}`, '_blank');
                            }
                          }}
                          variant="outline"
                          size="sm"
                        >
                          View Event
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/campaigns")}
                      className="w-full"
                    >
                      View All Events
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted mb-4">No upcoming events at the moment</p>
                    <Button onClick={() => router.push("/campaigns")}>
                      Browse Events
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
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
          )}
        </div>

        {/* Updates Panel */}
        <div className="mb-8">
          <UpdatesPanel 
            audience="influencer" 
            apiBaseUrl="https://thejaayveeworld.com"
          />
        </div>

        {/* Recent Activity */}
        {!isAdmin || influencerProfile ? (
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
        ) : null}
      </main>
    </div>
  );
}
