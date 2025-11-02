// Authentication utilities for influencer frontend
export interface InfluencerUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  roleLevel: number;
}

export interface InfluencerProfile {
  id: string;
  referralCode: string;
  tier: string;
  instagramHandle?: string;
  youtubeHandle?: string;
  instagramFollowers?: number;
  youtubeSubscribers?: number;
  totalEarnings: string;
}

export const authUtils = {
  // Get user from localStorage
  getUser: (): InfluencerUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem('influencerUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  // Get influencer profile from localStorage
  getProfile: (): InfluencerProfile | null => {
    if (typeof window === 'undefined') return null;
    try {
      const profile = localStorage.getItem('influencerProfile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error parsing profile from localStorage:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authUtils.getUser() !== null;
  },

  // Clear authentication data
  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('influencerUser');
    localStorage.removeItem('influencerProfile');
  },

  // Set authentication data
  setAuth: (user: InfluencerUser, profile: InfluencerProfile | null): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('influencerUser', JSON.stringify(user));
    if (profile) {
      localStorage.setItem('influencerProfile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('influencerProfile');
    }
    // Store admin flag if user is admin
    if (user.roleLevel >= 4 || user.role === 'admin' || user.role === 'super_admin') {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
    }
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    if (typeof window === 'undefined') return false;
    const isAdminFlag = localStorage.getItem('isAdmin');
    if (isAdminFlag === 'true') return true;
    const user = authUtils.getUser();
    return user ? (user.roleLevel >= 4 || user.role === 'admin' || user.role === 'super_admin') : false;
  }
};
