// components/SplashScreen.tsx
"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';

// Pastikan path ke logo Anda benar
import spotifyLogo from '../public/spotify-logo.png'; 

const SplashScreen = ({ onFinished }: { onFinished: () => void }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Mulai proses fade-out setelah 1.5 detik
        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 1500);

        // Sembunyikan splash screen sepenuhnya setelah animasi fade-out selesai
        const finishTimer = setTimeout(() => {
            onFinished();
        }, 2000); // 1500ms + 500ms durasi transisi

        // Bersihkan timer saat komponen di-unmount
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinished]);

    return (
        <div
            className={`fixed inset-0 bg-black z-[100] flex items-center justify-center transition-opacity duration-500 ${
                isFadingOut ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <Image src={spotifyLogo} alt="Spotify Logo" width={120} height={120} priority />
        </div>
    );
};

export default SplashScreen;