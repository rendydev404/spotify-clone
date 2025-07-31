// components/TrackDetailsClient.tsx
"use client";

import { Track } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Play, Pause, Plus, Check, Music4, LoaderCircle } from "lucide-react";
import { usePlayer } from "@/app/context/PlayerContext";
import TrackListItem from './TrackListItem';
import { TrackListSkeleton } from './TrackCardSkeleton';

const Toast = ({ message, show }: { message: string, show: boolean }) => (
  <div 
    className={`
      fixed bottom-28 left-1/2 -translate-x-1/2 
      bg-zinc-800/90 backdrop-blur-sm text-white 
      py-3 px-6 rounded-full shadow-xl
      border border-white/10
      transition-all duration-300 transform
      flex items-center gap-2
      ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
    `}
  >
    {show && <Check size={18} className="text-primary" />}
    {message}
  </div>
);

export default function TrackDetailsClient({ track }: { track: Track }) {
  const { activeTrack, isPlaying, isLoading, playSong } = usePlayer();
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  
  const isCurrentTrack = activeTrack?.id === track.id;

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!track.artists[0]) return;
      setIsLoadingRecs(true);
      try {
        const res = await fetch(`/api/spotify?q=artist:${encodeURIComponent(track.artists[0].name)}&type=track&limit=10`);
        const data = await res.json();
        // Filter lagu saat ini dari rekomendasi
        setRecommendations(data?.tracks?.items.filter((rec: Track) => rec.id !== track.id) || []);
      } catch (error) {
        console.error("Gagal mengambil rekomendasi", error);
      } finally {
        setIsLoadingRecs(false);
      }
    };
    
    fetchRecommendations();
    
    const existingPlaylist: Track[] = JSON.parse(localStorage.getItem('my-playlist') || '[]');
    setIsInPlaylist(existingPlaylist.some(item => item.id === track.id));
  }, [track.id, track.artists]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handlePlayClick = () => playSong(track, [track, ...recommendations], 0);

  const handlePlaylistToggle = () => {
    const existingPlaylist: Track[] = JSON.parse(localStorage.getItem('my-playlist') || '[]');
    if (isInPlaylist) {
      const newPlaylist = existingPlaylist.filter(item => item.id !== track.id);
      localStorage.setItem('my-playlist', JSON.stringify(newPlaylist));
      setIsInPlaylist(false);
      setToastMessage("Lagu dihapus dari playlist");
    } else {
      const newPlaylist = [...existingPlaylist, track];
      localStorage.setItem('my-playlist', JSON.stringify(newPlaylist));
      setIsInPlaylist(true);
      setToastMessage("Lagu ditambahkan ke playlist");
    }
  };

  const imageUrl = track.album.images?.[0]?.url;

  return (
    <>
      <main className="bg-zinc-900 text-white min-h-screen">
        {/* Hero Section with Gradient */}
        <div className="relative w-full bg-gradient-to-b from-primary/80 via-primary/40 to-zinc-900 pb-8">
          {/* Blurred Background Image */}
          {imageUrl && (
            <div className="absolute inset-0 overflow-hidden">
              <Image 
                src={imageUrl} 
                alt="" 
                fill 
                className="opacity-30 blur-2xl scale-110"
                style={{ objectFit: 'cover' }}
                priority 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-zinc-900/60 to-zinc-900"></div>
            </div>
          )}

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
              {/* Album Cover */}
              <div className="flex-shrink-0 w-64 h-64 md:w-72 md:h-72 relative group">
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt={track.name} 
                    width={288} 
                    height={288} 
                    className="rounded-lg shadow-2xl group-hover:shadow-primary/50 transition-all duration-300" 
                    priority 
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
                    <Music4 size={64} />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex flex-col gap-4 flex-grow md:max-w-2xl text-center md:text-left">
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">Lagu</span>
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-6xl font-black leading-tight break-words">
                    {track.name || "Judul Tidak Diketahui"}
                  </h1>
                  <p className="text-lg md:text-xl text-zinc-300">
                    {track.artists?.map((artist) => artist.name).join(", ") || "Artis Tidak Diketahui"}
                  </p>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Recommendations Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={handlePlayClick} 
              disabled={isLoading && isCurrentTrack} 
              className="bg-primary hover:bg-primary/90 rounded-full p-4 text-white hover:scale-105 transition-all duration-300 flex items-center justify-center w-20 h-20 shadow-lg hover:shadow-primary/50"
            >
              {isLoading && isCurrentTrack ? (
                <LoaderCircle size={32} className="animate-spin" />
              ) : isPlaying && isCurrentTrack ? (
                <Pause size={32} className="fill-white" />
              ) : (
                <Play size={32} className="fill-white ml-1" />
              )}
            </button>
            <button 
              onClick={handlePlaylistToggle} 
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105"
            >
              {isInPlaylist ? (
                <Check size={32} className="text-primary" />
              ) : (
                <Plus size={32} />
              )}
            </button>
          </div>

          {/* Recommendations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Rekomendasi Lagu Serupa</h2>
            <div className="bg-zinc-800/50 rounded-xl p-4 space-y-2">
              {isLoadingRecs ? (
                Array.from({ length: 5 }).map((_, i) => <TrackListSkeleton key={i} />)
              ) : recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <TrackListItem 
                    key={rec.id} 
                    track={rec} 
                    onPlay={() => playSong(rec, [track, ...recommendations], index + 1)} 
                  />
                ))
              ) : (
                <p className="text-zinc-400 text-center py-4">Tidak ada rekomendasi saat ini</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Toast message={toastMessage} show={!!toastMessage} />
    </>
  );
}