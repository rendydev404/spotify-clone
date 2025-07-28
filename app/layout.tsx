// app/layout.tsx
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { PlayerProvider } from "@/app/context/PlayerContext";
import GlobalPlayer from "@/components/GlobalPlayer";
import SplashScreen from "@/components/SplashScreen";
import { useState, useEffect } from "react";
import AIPlaylistGenerator from "@/components/AIPlaylistGenerator"; // Impor komponen AI
import DevInfo from "@/components/DevInfo"; // Impor komponen DevInfo
import GoogleAnalytics from "@/components/GoogleAnalytics"; // Impor Google Analytics

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // ... (logika untuk memuat tema tetap sama)
  }, []);

  return (
    <html lang="en">
      <head>
          <title>Spotify Clone</title>
          <meta name="description" content="Spotify clone built with Next.js" />
      </head>
      <body className="bg-background text-text-primary">
        {showSplash ? (
          <SplashScreen onFinished={() => setShowSplash(false)} />
        ) : (
          <PlayerProvider>
            <div className="flex h-full">
              <Sidebar />
              <main className="flex-1 overflow-y-auto pb-32 md:pb-24">
                {children}
              </main>
            </div>
            <AIPlaylistGenerator /> {/* Letakkan komponen di sini */}
            <GlobalPlayer />
            <DevInfo /> {/* Developer Info dengan floating icon */}
            <GoogleAnalytics /> {/* Google Analytics tracking */}
          </PlayerProvider>
        )}
      </body>
    </html>
  );
}