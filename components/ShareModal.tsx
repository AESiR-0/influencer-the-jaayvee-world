"use client";

import { Copy, Facebook, Linkedin, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  title?: string;
}

export default function ShareModal({ isOpen, onClose, link, title = "Check this out!" }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `${title} ${link}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedLink = encodeURIComponent(link);

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedText}`,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      color: "bg-blue-500 hover:bg-blue-600"
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Share Referral Link</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Your referral link:</p>
            <p className="text-sm font-mono text-gray-900 break-all">{link}</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full justify-start"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            <div className="grid grid-cols-3 gap-2">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.name}
                    onClick={() => window.open(option.url, "_blank")}
                    className={`${option.color} text-white`}
                    size="sm"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {option.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
