"use client";

import { useState, useEffect, useRef } from "react";
import TrackCard from "@/components/TrackCard";
import { TrackCardSkeleton } from "@/components/TrackCardSkeleton";
import { Track } from "@/types";
import { usePlayer } from "@/app/context/PlayerContext";
import { Music, Sparkles, Search, Smartphone, User, Play } from "lucide-react";
import Image from "next/image";
import spotifyLogo from "../public/spotify-logo.png";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const songCardsRef = useRef<HTMLElement>(null);

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

  const features = [
    {
      title: "Musik Streaming Gratis",
      description: "Akses jutaan lagu hits tanpa biaya. Nikmati musik berkualitas tinggi dengan player yang responsif.",
      icon: Music,
    },
    {
      title: "AI Playlist Generator",
      description: "Buat playlist otomatis dengan AI canggih. Cukup berikan deskripsi, AI akan membuat playlist sesuai mood.",
      icon: Sparkles,
    },
    {
      title: "Search Musik Cepat",
      description: "Temukan lagu favorit dengan mudah. Search engine yang powerful untuk mencari artis, album, dan lagu.",
      icon: Search,
    },
    {
      title: "Responsive Design",
      description: "Akses dari mana saja - desktop, tablet, atau smartphone. Interface yang user-friendly di semua device.",
      icon: Smartphone,
    },
  ];

  const scrollToSongCards = () => {
    songCardsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const navigateToSearch = () => {
    router.push('/search');
  };

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-0 md:p-0">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-purple-600 to-primary/80 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/spotify-logo.png"
              alt="Spotify Clone - Platform Musik Streaming"
              width={120}
              height={120}
              className="mx-auto rounded-full mb-6 drop-shadow-2xl"
              priority
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Spotify Clone
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto leading-relaxed">
              Platform musik streaming gratis. Dengarkan lagu-lagu hits dari artis favorit dengan kualitas HD.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                onClick={scrollToSongCards}
              >
                <Play size={24} />
                Mulai Dengarkan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2"
                onClick={navigateToSearch}
              >
                <Search size={24} />
                Cari Lagu
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Discover Music Section */}
      <section ref={songCardsRef} className="py-16 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Temukan Musik Baru
            </h2>
            <p className="text-gray-300 text-lg">
              Jelajahi lagu-lagu hits dari artis favorit
            </p>
          </motion.div>

          {isLoading ? <SkeletonGrid /> : <TracksGrid tracks={discoverTracks} />}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-gray-300 text-lg">
              Platform musik streaming dengan teknologi terdepan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800 p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Spotify Clone - Platform Musik Streaming
          </p>
        </div>
      </footer>
    </main>
  );
}