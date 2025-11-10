"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, DollarSign, History, Award, ArrowUpRight, ArrowDownRight, Users, Calendar } from "lucide-react";
import Header from "@/components/Header";
import { api } from "@/lib/api";
import { authUtils } from "@/lib/auth-utils";
import TierTimelineModal from "@/components/tier-timeline-modal";

interface WalletData {
  wallet: {
    balance: number;
    currency: string;
  };
  earnings: {
    totalEarnings: string;
    totalReferrals: number;
    tier?: string;
    currentCommissionRate?: number;
    pendingEarnings?: string;
    tierProgress?: {
      current: number;
      next: number | null;
      progress: number;
    };
    allTiers?: Array<{
      tier: string;
      commissionRate: number;
      minReferrals: number;
      maxReferrals: number | null;
      isCurrent: boolean;
    }>;
  };
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    reference: string | null;
    createdAt: Date | string;
  }>;
  partnerCode?: string | null;
}

export default function WalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showTierModal, setShowTierModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const session = authUtils.getSession();
        if (!session || !session.user) {
          throw new Error('Not authenticated');
        }
        setUser(session.user);
        await fetchWalletData(session.user.id);
      } catch (err: any) {
        setError(err.message || 'Failed to load wallet');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Store partner code in cookie if available
  useEffect(() => {
    if (walletData?.partnerCode && typeof window !== 'undefined') {
      document.cookie = `partnerCode=${walletData.partnerCode}; path=/; max-age=${365 * 24 * 60 * 60}`; // 1 year
    }
  }, [walletData?.partnerCode]);

  const fetchWalletData = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://talaash.thejaayveeworld.com';
      const token = localStorage.getItem('influencerAuthToken');
      
      const response = await fetch(`${API_BASE_URL}/api/influencers/wallet`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallet data');
      }

      const result = await response.json();
      if (result.success) {
        setWalletData(result.data);
      } else {
        throw new Error(result.error || 'Failed to load wallet');
      }
    } catch (err: any) {
      console.error('Error fetching wallet:', err);
      setError(err.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-accent border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading wallet data...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
          <div className="max-w-md mx-auto mt-12">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 rounded-full p-2">
                  <History className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900">Error Loading Wallet</h3>
              </div>
              <p className="text-red-800 mb-6">{error}</p>
              <button
                onClick={() => user && fetchWalletData(user.id)}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!walletData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No wallet data available</p>
            <p className="text-sm text-gray-400">Please contact support if this issue persists</p>
          </div>
        </div>
      </>
    );
  }

  // Calculate average earnings per referral
  const avgEarningsPerReferral = walletData.earnings.totalReferrals > 0 
    ? parseFloat(walletData.earnings.totalEarnings) / walletData.earnings.totalReferrals 
    : 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Wallet & Earnings</h1>
          <p className="text-gray-600">Manage your earnings and track your influencer performance</p>
        </div>

        {/* Partner Code Display */}
        {walletData?.partnerCode && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Partner Code</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <input
                type="text"
                value={walletData.partnerCode}
                disabled
                readOnly
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-mono"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(walletData.partnerCode!);
                  alert('Partner code copied to clipboard!');
                }}
                className="px-4 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 transition-colors whitespace-nowrap"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">This is the referral code used when you signed up</p>
          </div>
        )}

        {/* Main Wallet Balance Card - Hero Section */}
        <div className="bg-gradient-to-br from-primary-accent via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/90 text-sm md:text-base mb-1 font-medium">Available Balance</p>
                <p className="text-4xl md:text-5xl font-bold mb-2">
                  {walletData.wallet.currency === 'INR' ? '₹' : walletData.wallet.currency + ' '}
                  {parseFloat(String(walletData.wallet.balance)).toLocaleString('en-IN', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
                <p className="text-white/70 text-sm">Ready to withdraw</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <Wallet className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {/* Total Earnings Card */}
          <div className="card p-5 md:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-semibold text-gray-700">Total Earnings</h3>
              <div className="bg-green-100 rounded-lg p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              ₹{parseFloat(walletData.earnings.totalEarnings).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            <p className="text-xs md:text-sm text-gray-500">All-time campaign earnings</p>
          </div>

          {/* Total Referrals Card */}
          <div className="card p-5 md:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-semibold text-gray-700">Total Referrals</h3>
              <div className="bg-blue-100 rounded-lg p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {walletData.earnings.totalReferrals.toLocaleString()}
            </p>
            <p className="text-xs md:text-sm text-gray-500">Users referred</p>
          </div>

          {/* Average per Referral Card */}
          <div 
            className="card p-5 md:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer"
            onClick={() => setShowTierModal(true)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-semibold text-gray-700">Avg per Referral</h3>
              <div className="bg-purple-100 rounded-lg p-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              ₹{avgEarningsPerReferral.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              {walletData.earnings.currentCommissionRate ? `${walletData.earnings.currentCommissionRate}% commission rate` : 'Per referral average'}
            </p>
            {walletData.earnings.pendingEarnings && parseFloat(walletData.earnings.pendingEarnings) > 0 && (
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                ₹{parseFloat(walletData.earnings.pendingEarnings).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} pending
              </p>
            )}
            <p className="text-xs text-purple-600 mt-2 font-medium">Click to view tier progression →</p>
          </div>

          {/* Tier Card */}
          {walletData.earnings.tier ? (
            <div className="card p-5 md:p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-700">Influencer Tier</h3>
                <div className="bg-yellow-100 rounded-lg p-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 capitalize">
                {walletData.earnings.tier}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Your current tier</p>
            </div>
          ) : (
            <div className="card p-5 md:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-700">Tier</h3>
                <div className="bg-gray-100 rounded-lg p-2">
                  <Award className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-400 mb-1">-</p>
              <p className="text-xs md:text-sm text-gray-500">No tier assigned</p>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="card p-5 md:p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary-accent/10 rounded-lg p-2">
                <History className="h-5 w-5 text-primary-accent" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Transaction History</h2>
                <p className="text-sm text-gray-500">Recent wallet activity</p>
              </div>
            </div>
            {walletData.transactions.length > 0 && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{walletData.transactions.length} transactions</span>
              </div>
            )}
          </div>
          
          {walletData.transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <History className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-1">No transactions yet</p>
              <p className="text-sm text-gray-400">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletData.transactions.map((transaction) => {
                const isCredit = transaction.type === 'credit';
                const date = new Date(transaction.createdAt);
                const isToday = date.toDateString() === new Date().toDateString();
                const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();
                
                let dateLabel = '';
                if (isToday) dateLabel = 'Today';
                else if (isYesterday) dateLabel = 'Yesterday';
                else dateLabel = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
                
                return (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Transaction Icon */}
                      <div className={`rounded-full p-3 ${
                        isCredit ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isCredit ? (
                          <ArrowUpRight className={`h-5 w-5 ${isCredit ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <ArrowDownRight className={`h-5 w-5 ${isCredit ? 'text-green-600' : 'text-red-600'}`} />
                        )}
                      </div>
                      
                      {/* Transaction Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-semibold text-gray-900 ${
                            isCredit ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {isCredit ? 'Credit' : 'Debit'}
                          </span>
                          {transaction.reference && (
                            <span className="text-xs text-gray-500 truncate max-w-[200px]">
                              • {transaction.reference}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{dateLabel} at {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="text-right">
                        <p className={`text-lg md:text-xl font-bold ${
                          isCredit ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isCredit ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tier Timeline Modal */}
        {walletData && (
          <TierTimelineModal
            isOpen={showTierModal}
            onClose={() => setShowTierModal(false)}
            currentTier={(walletData.earnings.tier || 'Hustler') as any}
            currentReferrals={walletData.earnings.totalReferrals}
          />
        )}
      </div>
    </>
  );
}

