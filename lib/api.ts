import { auth } from "./firebaseClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  if (!auth) {
    throw new Error("Firebase not initialized");
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// API functions
export const api = {
  // Auth
  verifyToken: () =>
    apiRequest("/influencers/auth/verify-token", { method: "POST" }),

  // Profile
  getProfile: (userId: string) =>
    apiRequest(`/influencers/profile?userId=${userId}`),

  // Referrals
  getReferral: (influencerId: string) =>
    apiRequest(`/influencers/referral?influencerId=${influencerId}`),
  generateReferral: (influencerId: string) =>
    apiRequest("/influencers/referral", {
      method: "POST",
      body: JSON.stringify({ influencerId }),
    }),

  // Submissions
  getSubmissions: (influencerId: string) =>
    apiRequest(`/influencers/submissions?influencerId=${influencerId}`),
  uploadSubmission: (data: any) =>
    apiRequest("/influencers/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Wallet
  getWallet: (userId: string) => apiRequest(`/shared/wallets?userId=${userId}`),
};
