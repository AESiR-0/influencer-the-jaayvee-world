import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jaayvee Influencers - Promote & Earn Cashback",
    template: "%s | Jaayvee Influencers",
  },
  description:
    "Join Jaayvee Influencers program and earn cashback by promoting merchants and events with proof uploads. Turn your social influence into earnings.",
  keywords: [
    "influencer program",
    "social media marketing",
    "cashback",
    "content creation",
    "Jaayvee influencers",
    "influencer earnings",
    "social promotion",
    "content marketing",
    "influencer dashboard",
    "social influence",
    "brand promotion",
    "influencer campaigns",
    "social media earnings",
    "content creator",
    "influencer network",
  ],
  authors: [{ name: "Jaayvee Team", url: "https://thejaayveeworld.com" }],
  creator: "Jaayvee",
  publisher: "Jaayvee",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://influencers.jaayvee.com",
    siteName: "Jaayvee Influencers",
    title: "Jaayvee Influencers - Promote & Earn Cashback",
    description:
      "Join Jaayvee Influencers program and earn cashback by promoting merchants and events with proof uploads. Turn your social influence into earnings.",
    images: [
      {
        url: "/static/logos/influencers/influencers_og.png",
        width: 1200,
        height: 630,
        alt: "Jaayvee Influencers - Promote & Earn Cashback",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaayvee Influencers - Promote & Earn Cashback",
    description:
      "Join Jaayvee Influencers program and earn cashback by promoting merchants and events with proof uploads. Turn your social influence into earnings.",
    images: ["/static/logos/influencers/influencers_twitter.png"],
    creator: "@jaayvee",
  },
  icons: {
    icon: "/static/logos/influencers/influencers_fav.png",
    shortcut: "/static/logos/influencers/influencers_fav.png",
    apple: "/static/logos/influencers/influencers_fav.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://influencers.jaayvee.com",
  },
  category: "entertainment",
  // PWA theme color
  themeColor: "#1e3a8a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jaayvee Influencers",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/static/logos/influencers/influencers_icon_192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jaayvee Influencers" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Jaayvee Influencers",
              url: "https://influencers.jaayvee.com",
              logo: "https://influencers.jaayvee.com/static/logos/influencers/influencers_logo.png",
              description:
                "Join Jaayvee Influencers program and earn cashback by promoting merchants and events with proof uploads. Turn your social influence into earnings.",
              foundingDate: "2024",
              founders: [
                {
                  "@type": "Person",
                  name: "Jaayvee Team",
                },
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-XXXXXXXXXX",
                contactType: "customer service",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://twitter.com/jaayvee",
                "https://linkedin.com/company/jaayvee",
                "https://instagram.com/jaayvee",
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressRegion: "Maharashtra",
                addressLocality: "Mumbai",
              },
              serviceType: "Influencer Marketing Platform",
              areaServed: {
                "@type": "Country",
                name: "India",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
