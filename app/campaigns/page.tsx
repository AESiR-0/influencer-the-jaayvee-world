'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseClient';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Copy, Plus, ExternalLink, QrCode } from 'lucide-react';

interface ReferralData {
  code: string;
  link: string;
  venture: string;
  createdAt: string;
}

export default function CampaignsPage() {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!auth || !auth.currentUser) {
        router.push('/login');
        return;
      }

      try {
        setIsLoading(true);
        const data = await api.getReferral(auth.currentUser.uid);
        setReferrals(Array.isArray(data) ? data : [data].filter(Boolean));
      } catch (error) {
        console.error('Failed to fetch referrals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [router]);

  const handleGenerateReferral = async () => {
    if (!auth.currentUser) return;
    
    setIsGenerating(true);
    try {
      const newReferral = await api.generateReferral(auth.currentUser.uid);
      setReferrals(prev => [...prev, newReferral]);
    } catch (error) {
      console.error('Failed to generate referral:', error);
      alert('Failed to generate referral code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
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
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fg mb-2">Campaigns</h1>
            <p className="text-muted">Manage your referral links and codes</p>
          </div>
          <Button 
            onClick={handleGenerateReferral}
            disabled={isGenerating}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate New Code'}
          </Button>
        </div>

        {referrals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {referrals.map((referral, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Referral Code</span>
                    <span className="text-sm font-normal text-muted">
                      {referral.venture || 'General'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-accent-light rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-accent font-mono text-lg font-bold">
                        {referral.code}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(referral.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted">
                      Created: {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {referral.link && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-fg">
                        Referral Link:
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={referral.link}
                          readOnly
                          className="flex-1 px-3 py-2 border border-border rounded-xl bg-bg text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(referral.link)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(referral.link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(referral.code)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                    {referral.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(referral.link)}
                        className="flex-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <QrCode className="h-12 w-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fg mb-2">
                No Referral Codes Yet
              </h3>
              <p className="text-muted mb-6">
                Generate your first referral code to start earning cashback
              </p>
              <Button onClick={handleGenerateReferral} disabled={isGenerating}>
                <Plus className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Your First Code'}
              </Button>
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
                    Share your referral code or link with your followers on social media
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
                    When someone uses your code, you'll earn cashback on their purchases
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-fg">Upload Proof</h4>
                  <p className="text-sm text-muted">
                    Upload screenshots of your posts to get cashback approved
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
