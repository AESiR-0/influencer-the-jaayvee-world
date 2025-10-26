"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { api } from "@/lib/api";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Mail, Phone, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "otp">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged(
      async (user: firebase.User | null) => {
        if (user) {
          try {
            await api.verifyToken();
            router.push("/dashboard");
          } catch (error) {
            console.error("Token verification failed:", error);
          }
        }
      },
    );

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Initialize reCAPTCHA
    if (typeof window !== "undefined" && !recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        },
      });
      setRecaptchaVerifier(verifier);
    }
  }, [recaptchaVerifier]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await api.verifyToken();
      router.push("/dashboard");
    } catch (error) {
      console.error("Email login error:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!recaptchaVerifier) throw new Error("reCAPTCHA not initialized");

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifier,
      );
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
    } catch (error) {
      console.error("OTP send error:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!window.confirmationResult) throw new Error("No confirmation result");

      await window.confirmationResult.confirm(otp);
      await api.verifyToken();
      router.push("/dashboard");
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Invalid OTP. Please try again.");
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
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Button
                variant={loginMethod === "email" ? "default" : "outline"}
                onClick={() => setLoginMethod("email")}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant={loginMethod === "otp" ? "default" : "outline"}
                onClick={() => setLoginMethod("otp")}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                OTP
              </Button>
            </div>

            {loginMethod === "email" ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-fg mb-2"
                  >
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-fg mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOTP}>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-fg mb-2"
                      >
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
                    <Button
                      type="submit"
                      className="w-full mt-4"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP}>
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-fg mb-2"
                      >
                        Enter OTP
                      </label>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit OTP"
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-4"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOtpSent(false)}
                      className="w-full mt-2"
                    >
                      Change Phone Number
                    </Button>
                  </form>
                )}
              </div>
            )}

            <div id="recaptcha-container"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// Extend Window interface for TypeScript
declare global {
  interface Window {
    confirmationResult: firebase.auth.ConfirmationResult | null;
  }
}
