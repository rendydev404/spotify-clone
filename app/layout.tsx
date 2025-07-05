// app/layout.tsx
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { PlayerProvider } from "@/app/context/PlayerContext";
import GlobalPlayer from "@/components/GlobalPlayer";
import SplashScreen from "@/components/SplashScreen";
import { useState } from "react"; // Hanya import yang digunakan

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <html lang="en">
      <head>
          <title>Spotify Clone</title>
          <meta name="description" content="Spotify clone built with Next.js" />
      </head>
      <body className={`${inter.className} bg-black`}>
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
            <GlobalPlayer />
          </PlayerProvider>
        )}
      </body>
    </html>
  );
}