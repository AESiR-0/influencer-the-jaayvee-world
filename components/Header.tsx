"use client";

import { Calendar, LogOut, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authUtils } from "@/lib/auth-utils";
import { Button } from "@/ui/button";
import Link from "next/link";

export default function Header() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Clear authentication data
      authUtils.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-bg border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
          <h1 className="text-xl font-bold text-fg hover:text-accent transition-colors cursor-pointer">The Jaayvee World</h1>
          </Link>
          <span className="text-sm text-muted">Influencers Dashboard</span>
        </div>

        <div className="flex items-center space-x-4">
        <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/campaigns")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Campaigns
          </Button>
        <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/submissions")}
          >
            <Upload className="h-4 w-4 mr-2" />
              Submissions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/profile")}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
