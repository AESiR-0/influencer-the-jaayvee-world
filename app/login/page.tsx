"use client";

import { ArrowRight, Mail, UserPlus, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { authUtils } from "@/lib/auth-utils";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [youtubeHandle, setYoutubeHandle] = useState("");
  const [instagramFollowers, setInstagramFollowers] = useState("");
  const [youtubeSubscribers, setYoutubeSubscribers] = useState("");
  const [tier, setTier] = useState("Bronze");
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in by checking localStorage
    if (authUtils.isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.login({ email, password });
      
      // Store user data using auth utils
      // Handle admin login (influencer might be null for admins)
      authUtils.setAuth(response.data.user, response.data.influencer || null);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.register({
        email,
        password,
        fullName,
        phone,
        instagramHandle,
        youtubeHandle,
        instagramFollowers: parseInt(instagramFollowers) || 0,
        youtubeSubscribers: parseInt(youtubeSubscribers) || 0,
        tier
      });
      
      // Store user data using auth utils
      authUtils.setAuth(response.data.user, response.data.influencer || null);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fg mb-2">The Jaayvee World</h1>
          <p className="text-muted">Influencers Dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {authMode === "login" ? "Sign In" : "Sign Up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Button
                variant={authMode === "login" ? "default" : "outline"}
                onClick={() => setAuthMode("login")}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button
                variant={authMode === "register" ? "default" : "outline"}
                onClick={() => setAuthMode("register")}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </Button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-fg mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-fg mb-2">
                    Password
                  </label>
                  <div className="relative">
                  <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-fg focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-fg mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-fg mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-fg mb-2">
                    Password
                  </label>
                  <div className="relative">
                  <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-fg focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-fg mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="instagramHandle" className="block text-sm font-medium text-fg mb-2">
                    Instagram Handle
                  </label>
                  <input
                    id="instagramHandle"
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@username"
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="youtubeHandle" className="block text-sm font-medium text-fg mb-2">
                    YouTube Handle
                  </label>
                  <input
                    id="youtubeHandle"
                    type="text"
                    value={youtubeHandle}
                    onChange={(e) => setYoutubeHandle(e.target.value)}
                    placeholder="@username"
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="instagramFollowers" className="block text-sm font-medium text-fg mb-2">
                      Instagram Followers
                    </label>
                    <input
                      id="instagramFollowers"
                      type="number"
                      value={instagramFollowers}
                      onChange={(e) => setInstagramFollowers(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="youtubeSubscribers" className="block text-sm font-medium text-fg mb-2">
                      YouTube Subscribers
                    </label>
                    <input
                      id="youtubeSubscribers"
                      type="number"
                      value={youtubeSubscribers}
                      onChange={(e) => setYoutubeSubscribers(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="tier" className="block text-sm font-medium text-fg mb-2">
                    Tier
                  </label>
                  <select
                    id="tier"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
