"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/lib/firebaseClient";
import type { User } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (!auth) {
      router.push("/login");
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
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
