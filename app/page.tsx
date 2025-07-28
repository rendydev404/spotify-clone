"use client";

import { useState, useEffect } from "react";
import TrackCard from "@/components/TrackCard";
import { TrackCardSkeleton } from "@/components/TrackCardSkeleton";
import { Track } from "@/types";
import { usePlayer } from "@/app/context/PlayerContext";
import { Music, Sparkles, Search, Smartphone, User } from "lucide-react";
import Image from "next/image";
import spotifyLogo from "../public/spotify-logo.png";

const shuffleArray = (array: Track[]): Track[] => {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function HomePage() {
  const [discoverTracks, setDiscoverTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    const getDiscoverTracks = async () => {
      setIsLoading(true);
      try {
        const artists = ['Taylor Swift', 'James Arthur', 'Yovie & Nuno', 'Tulus'];
        const promises = artists.map(artist =>
          fetch(`/api/spotify?q=artist:${encodeURIComponent(artist)}&type=track&limit=5`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        const allTracks = results.flatMap(result => result.tracks?.items || []);
        const validTracks = allTracks.filter((track: Track) => track && track.album?.images?.length > 0);
        setDiscoverTracks(shuffleArray(validTracks));
      } catch (error) {
        console.error("Gagal mengambil lagu rekomendasi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getDiscoverTracks();
  }, []);

  const TracksGrid = ({ tracks }: { tracks: Track[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {tracks.map((track, index) => (
        <TrackCard
          key={`${track.id}-${index}`}
          track={track}
          onPlay={() => playSong(track, tracks, index)}
        />
      ))}
    </div>
  );
  
  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
       {Array.from({ length: 12 }).map((_, i) => <TrackCardSkeleton key={i} />)}
    </div>
  );

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-0 md:p-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[340px] flex flex-col justify-center items-center text-center py-16 md:py-24 bg-gradient-to-br from-primary/80 via-purple-800/60 to-zinc-900">
        <div className="absolute inset-0 pointer-events-none select-none opacity-30 blur-2xl" style={{zIndex:0}}>
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/30 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="bg-white/10 p-0.5 rounded-full shadow-2xl mb-4 animate-bounce-slow border-4 border-primary">
            <Image src={spotifyLogo} alt="Spotify Logo" width={80} height={80} className="rounded-full drop-shadow-lg" priority />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
            Spotify Clone
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-4">
            Musik Streaming Gratis Terbaik 2025 dengan AI Playlist Generator. Dengarkan lagu hits dari Taylor Swift, James Arthur, Yovie & Nuno, Tulus, dan ribuan artis favorit lainnya.
          </p>
        </div>
      </section>

      {/* Fitur Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 -mt-16 z-20 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-zinc-800/80 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
            <Music size={36} className="text-primary mb-2" />
            <h3 className="text-lg font-bold mb-1">Musik Streaming Gratis</h3>
            <p className="text-gray-400 text-center text-sm">Akses jutaan lagu hits tanpa biaya. Nikmati musik berkualitas tinggi dengan player yang responsif.</p>
          </div>
          <div className="bg-zinc-800/80 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
            <Sparkles size={36} className="text-purple-400 mb-2" />
            <h3 className="text-lg font-bold mb-1">AI Playlist Generator</h3>
            <p className="text-gray-400 text-center text-sm">Buat playlist otomatis dengan AI canggih. Cukup berikan deskripsi, AI akan membuat playlist sesuai mood.</p>
          </div>
          <div className="bg-zinc-800/80 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
            <Search size={36} className="text-blue-400 mb-2" />
            <h3 className="text-lg font-bold mb-1">Search Musik Cepat</h3>
            <p className="text-gray-400 text-center text-sm">Temukan lagu favorit dengan mudah. Search engine yang powerful untuk mencari artis, album, dan lagu.</p>
          </div>
          <div className="bg-zinc-800/80 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
            <Smartphone size={36} className="text-green-400 mb-2" />
            <h3 className="text-lg font-bold mb-1">Responsive Design</h3>
            <p className="text-gray-400 text-center text-sm">Akses dari mana saja - desktop, tablet, atau smartphone. Interface yang user-friendly di semua device.</p>
          </div>
        </div>
      </section>

      {/* Artis Favorit Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-16 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Artis Favorit di Spotify Clone</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { name: "Taylor Swift" },
            { name: "James Arthur" },
            { name: "Yovie & Nuno" },
            { name: "Tulus" },
            { name: "Dan ribuan artis lainnya" },
          ].map((artist, idx) => (
            <div key={artist.name} className="flex flex-col items-center bg-zinc-800/80 rounded-xl p-4 w-40 shadow-md hover:scale-105 transition-transform">
              <div className="bg-primary/80 rounded-full p-4 mb-2">
                <User size={32} className="text-white" />
              </div>
              <span className="text-white font-semibold text-center text-base">{artist.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Lagu Pilihan Untukmu - Spotify Clone Terbaik 2025
        </h2>
        <p className="text-gray-300 mb-8">
          Koleksi lagu hits terbaru dari artis-artis favorit Indonesia dan internasional. 
          Update setiap hari dengan lagu-lagu trending.
        </p>
        {isLoading ? <SkeletonGrid /> : <TracksGrid tracks={discoverTracks} />}
      </section>

      {/* SEO Footer Content */}
      <footer className="mt-16 pt-8 border-t border-zinc-700 bg-zinc-900/80">
        <div className="grid md:grid-cols-3 gap-8 text-gray-300 max-w-6xl mx-auto px-4 md:px-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Spotify Clone</h3>
            <p>
              Platform musik streaming gratis terbaik 2025. Nikmati musik berkualitas tinggi 
              dengan fitur-fitur canggih seperti AI playlist generator dan search musik yang powerful.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Fitur Unggulan</h3>
            <ul className="space-y-2">
              <li><Music size={16} className="inline mr-2 text-primary" />Musik Streaming Gratis</li>
              <li><Sparkles size={16} className="inline mr-2 text-purple-400" />AI Playlist Generator</li>
              <li><Search size={16} className="inline mr-2 text-blue-400" />Search Musik Cepat</li>
              <li><Smartphone size={16} className="inline mr-2 text-green-400" />Player Musik Responsif</li>
              <li><User size={16} className="inline mr-2 text-white" />Lagu Hits Indonesia</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Artis Favorit</h3>
            <ul className="space-y-2">
              <li><User size={16} className="inline mr-2 text-white" />Taylor Swift</li>
              <li><User size={16} className="inline mr-2 text-white" />James Arthur</li>
              <li><User size={16} className="inline mr-2 text-white" />Yovie & Nuno</li>
              <li><User size={16} className="inline mr-2 text-white" />Tulus</li>
              <li><User size={16} className="inline mr-2 text-white" />Dan ribuan artis lainnya</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-zinc-700 text-center text-gray-400">
          <p>
            © 2025 Spotify Clone - Platform musik streaming gratis terbaik. 
            By Rendy Dev
          </p>
        </div>
      </footer>
    </main>
  );
}