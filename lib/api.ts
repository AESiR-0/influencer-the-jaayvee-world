const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://talaash.thejaayveeworld.com';

interface SubmissionData {
  screenshot: string;
  storyLink: string;
  amount: number;
  influencerId: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  instagramHandle?: string;
  youtubeHandle?: string;
  instagramFollowers?: number;
  youtubeSubscribers?: number;
  tier?: string;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Get auth token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('influencerAuthToken') : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

// API functions
export const api = {
  // Auth
  login: (data: LoginData) =>
    apiRequest("/api/influencers/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterData) =>
    apiRequest("/api/influencers/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyToken: () =>
    apiRequest("/api/influencers/auth/verify-token", { method: "POST" }),

  // Profile
  getProfile: (userId: string) =>
    apiRequest(`/api/influencers/profile?userId=${userId}`),

  // Referrals
  getReferral: (influencerId: string) =>
    apiRequest(`/api/influencers/referral?influencerId=${influencerId}`),
  generateReferral: (influencerId: string, originalUrl?: string) =>
    apiRequest("/api/influencers/referral", {
      method: "POST",
      body: JSON.stringify({ influencerId, originalUrl }),
    }),

  // Submissions
  getSubmissions: (influencerId: string) =>
    apiRequest(`/api/influencers/submissions?influencerId=${influencerId}`),
  uploadSubmission: (data: SubmissionData) =>
    apiRequest("/api/influencers/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Wallet
  getWallet: (userId: string) => apiRequest(`/api/shared/wallets?userId=${userId}`),

  // Events
  getEvents: () => apiRequest("/api/talaash/events/summary"),
};

// Helper function to generate referral links (similar to affiliate system)
export function generateReferralLink(code: string, urlPath?: string | null): string {
  const baseUrl = process.env.NEXT_PUBLIC_TALAASH_BASE_URL || 'https://talaash.thejaayveeworld.com';
  
  if (urlPath) {
    return `${baseUrl}${urlPath}?ref=${code}`;
  }
  
  return `${baseUrl}/r/${code}`;
}
