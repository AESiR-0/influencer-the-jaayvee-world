"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authUtils } from "@/lib/auth-utils";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in by checking localStorage
    if (authUtils.isAuthenticated()) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted">Redirecting...</p>
      </div>
    </div>
  );
}
