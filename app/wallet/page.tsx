"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, DollarSign, History, Award } from "lucide-react";
import Header from "@/components/Header";
import { api } from "@/lib/api";
import { authUtils } from "@/lib/auth-utils";

interface WalletData {
  wallet: {
    balance: number;
    currency: string;
  };
  earnings: {
    totalEarnings: string;
    totalReferrals: number;
    tier?: string;
  };
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    reference: string | null;
    createdAt: Date | string;
  }>;
}

export default function WalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

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
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
            <p className="ml-3 text-primary-muted">Loading wallet...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => user && fetchWalletData(user.id)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!walletData) {
    return (
      <>
        <Header />
        <div className="p-6">
          <p className="text-primary-muted">No wallet data available</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-primary-fg mb-6">Wallet & Earnings</h1>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-primary-accent to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-2">Wallet Balance</p>
              <p className="text-4xl font-bold">
                {walletData.wallet.currency === 'INR' ? '₹' : walletData.wallet.currency + ' '}
                {parseFloat(String(walletData.wallet.balance)).toLocaleString('en-IN', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
            <Wallet className="h-12 w-12 text-white/80" />
          </div>
        </div>

        {/* Earnings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-fg">Total Earnings</h3>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-primary-fg">
              ₹{parseFloat(walletData.earnings.totalEarnings).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            <p className="text-sm text-primary-muted mt-2">All-time earnings from campaigns</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-fg">Total Referrals</h3>
              <DollarSign className="h-6 w-6 text-primary-accent" />
            </div>
            <p className="text-3xl font-bold text-primary-fg">
              {walletData.earnings.totalReferrals.toLocaleString()}
            </p>
            <p className="text-sm text-primary-muted mt-2">Users referred through your code</p>
          </div>

          {walletData.earnings.tier && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-fg">Tier</h3>
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-primary-fg capitalize">
                {walletData.earnings.tier}
              </p>
              <p className="text-sm text-primary-muted mt-2">Influencer tier status</p>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-primary-fg" />
            <h2 className="text-xl font-semibold text-primary-fg">Recent Transactions</h2>
          </div>
          
          {walletData.transactions.length === 0 ? (
            <div className="text-center py-8 text-primary-muted">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary-fg">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary-fg">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary-fg">Reference</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-primary-fg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {walletData.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-primary-border hover:bg-primary-bg/50">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-primary-fg font-medium">
                        {transaction.type === 'credit' ? '+' : '-'}
                        ₹{Math.abs(transaction.amount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-primary-muted">
                        {transaction.reference || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-primary-muted">
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

