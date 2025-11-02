"use client";

import { Copy, ExternalLink, Share2, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ShareModal from "@/components/ShareModal";
import { api, generateReferralLink } from "@/lib/api";
import { authUtils } from "@/lib/auth-utils";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

interface ReferralData {
  id: string;
  code: string;
  link: string;
  ventureId: string;
  clicks: number;
  conversions: number;
  isActive: boolean;
  createdAt: string;
}

interface Event {
  id: string;
  slug: string;
  title: string;
  startDate: string;
  venue: string;
  venture: {
    id: string;
    name: string;
  };
}

export default function CampaignsPage() {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; link: string; title: string }>({
    isOpen: false,
    link: "",
    title: ""
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = authUtils.getUser();
      const influencerProfile = authUtils.getProfile();
      const isAdmin = authUtils.isAdmin();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // Admins can access even without influencer profile (can view events but no referrals)
      if (!influencerProfile && !isAdmin) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch referrals (only if influencer profile exists) and events in parallel
        const promises: Promise<any>[] = [api.getEvents()];
        
        if (influencerProfile && !isAdmin) {
          promises.push(api.getReferral(influencerProfile.id));
        } else {
          // For admins, create a resolved promise with empty array
          promises.push(Promise.resolve({ data: [] }));
        }
        
        const [eventsResponse, referralsResponse] = await Promise.all(promises);
        
        setReferrals(referralsResponse.data || []);
        
        // Combine recent and upcoming events
        const allEvents = [
          ...(eventsResponse.data?.summary?.recentEvents || []),
          ...(eventsResponse.data?.summary?.upcomingEvents || [])
        ];
        setEvents(allEvents);
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);


  const openShareModal = (link: string, title: string) => {
    setShareModal({
      isOpen: true,
      link,
      title
    });
  };


  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fg mb-2">Campaigns</h1>
            <p className="text-muted">Manage your referral links and codes</p>
          </div>
        
        </div>

        {/* Events with Referral Links */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {events.map((event) => {
              // Find existing referral for this event or create a general one
              const existingReferral = referrals.find(r => r.link?.includes(`/events/${event.slug}`));
              const referralCode = existingReferral?.code || `INF${event.id.slice(-6).toUpperCase()}`;
              const referralLink = generateReferralLink(referralCode, `/events/${event.slug}`);
              
              return (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-accent" />
                        {event.title}
                      </span>
                      <span className="text-sm font-normal text-muted">
                        {event.venture.name}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Event Details */}
                    <div className="p-4 bg-accent-light rounded-xl">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-accent" />
                        <span className="text-sm text-fg">{event.venue}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-accent" />
                        <span className="text-sm text-fg">
                          {new Date(event.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Referral Link */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-fg">
                        Your Referral Link:
                      </label>
                      <div className="font-mono text-sm text-gray-800 bg-gray-100 p-3 rounded-lg break-all">
                        {referralLink}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">
                          {existingReferral?.clicks || 0}
                        </div>
                        <div className="text-xs text-muted">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">
                          {existingReferral?.conversions || 0}
                        </div>
                        <div className="text-xs text-muted">Conversions</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(referralCode)}
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(referralLink)}
                        className="flex-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openShareModal(referralLink, `Check out this event: ${event.title}! Use my referral code: ${referralCode}`)}
                      className="w-full"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Event
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mb-8">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fg mb-2">
                No Events Available
              </h3>
              <p className="text-muted mb-6">
                No events are currently available for referral links
              </p>
            </CardContent>
          </Card>
        )}

   
        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use Your Referral Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-fg">Share Your Code</h4>
                  <p className="text-sm text-muted">
                    Share your referral code or link with your followers on
                    social media
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-fg">Track Usage</h4>
                  <p className="text-sm text-muted">
                    When someone uses your code, you'll earn cashback on their
                    purchases
                  </p>
                </div>
              </div>  <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-fg">Get paid</h4>
                    <p className="text-sm text-muted">
                      When someone uses your code, you get 10% of the total amount spent.
                  </p>
                </div>
              </div>
            
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, link: "", title: "" })}
        link={shareModal.link}
        title={shareModal.title}
      />
    </div>
  );
}
