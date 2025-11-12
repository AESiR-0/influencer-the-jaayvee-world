"use client";

import { Calendar, LogOut, Upload, User, Wallet, ArrowRight, UserCircle, Users, Shield, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authUtils } from "@/lib/auth-utils";
import { Button } from "@/ui/button";
import Link from "next/link";

export default function Header() {
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const router = useRouter();

  // Role switcher configuration
  const roles = [
    {
      name: 'Influencer Portal',
      url: typeof window !== 'undefined' ? window.location.origin : '',
      icon: UserCircle,
      current: true
    },
    {
      name: 'Staff Portal',
      url: 'https://staff.thejaayveeworld.com',
      icon: Shield,
      current: false
    },
    {
      name: 'Affiliate Portal',
      url: 'https://affiliates.thejaayveeworld.com',
      icon: Users,
      current: false
    },
    {
      name: 'Talaash',
      url: 'https://talaash.thejaayveeworld.com',
      icon: ArrowRight,
      current: false
    },
    {
      name: 'Main Site',
      url: 'https://thejaayveeworld.com',
      icon: ArrowRight,
      current: false
    }
  ];

  // Close role switcher when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showRoleSwitcher && !target.closest('.role-switcher-container')) {
        setShowRoleSwitcher(false);
      }
    };

    if (showRoleSwitcher) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRoleSwitcher]);

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
            onClick={() => router.push("/wallet")}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Wallet
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/profile")}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          {/* Role Switcher */}
          <div className="relative role-switcher-container">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Switch Role
              <ChevronDown 
                className={`h-4 w-4 ml-2 transition-transform duration-200 ${showRoleSwitcher ? 'rotate-180' : ''}`}
              />
            </Button>
            
            {/* Role Switcher Dropdown */}
            {showRoleSwitcher && (
              <div className="absolute top-full right-0 mt-2 bg-bg border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px]">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <a
                      key={role.name}
                      href={role.url}
                      target={role.current ? undefined : "_blank"}
                      rel={role.current ? undefined : "noopener noreferrer"}
                      onClick={(e) => {
                        setShowRoleSwitcher(false);
                        if (role.current) {
                          e.preventDefault();
                        }
                      }}
                      className={`
                        flex items-center gap-3 px-4 py-3 text-sm transition-colors
                        ${role.current 
                          ? 'bg-accent/10 text-accent cursor-default' 
                          : 'hover:bg-gray-50 text-fg cursor-pointer'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{role.name}</span>
                      {role.current && (
                        <span className="ml-auto text-xs text-muted">(Current)</span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
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
