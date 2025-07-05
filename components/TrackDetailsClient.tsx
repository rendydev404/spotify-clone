// components/TrackDetailsClient.tsx
"use client";

import { Track } from "@/types";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Plus, Check, Music4, LoaderCircle } from "lucide-react";
import YouTubePlayer from "./YouTubePlayer"; // <-- Impor YouTubePlayer
import { searchYouTubeForSong } from "@/lib/youtube"; // <-- Impor fungsi pencarian

// Komponen Notifikasi (Toast) - tidak ada perubahan
const Toast = ({ message, show }: { message: string, show: boolean }) => {
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-zinc-800 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
      {message}
    </div>
  );
};

export default function TrackDetailsClient({ track }: { track: Track }) {
  // State baru untuk YouTube Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const playerRef = useRef<any>(null); // Ref untuk mengontrol player YouTube

  // State yang sudah ada (playlist & notifikasi)
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Cek status playlist saat komponen dimuat
  useEffect(() => {
    const existingPlaylist: Track[] = JSON.parse(localStorage.getItem('my-playlist') || '[]');
    setIsInPlaylist(existingPlaylist.some(item => item.id === track.id));
  }, [track.id]);

  // Efek untuk notifikasi
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ✅ FUNGSI UTAMA: Mencari dan Memutar Lagu dari YouTube
  const handlePlay = async () => {
    setIsLoadingSong(true);
    
    const artistName = track.artists[0]?.name || 'artist';
    const videoId = await searchYouTubeForSong(track.name, artistName);
    
    setIsLoadingSong(false);

    if (videoId) {
      setYoutubeVideoId(videoId);
      setIsPlaying(true);
    } else {
      setToastMessage("Maaf, lagu tidak dapat diputar dari YouTube.");
    }
  };

  const handlePause = () => {
    playerRef.current?.pauseVideo();
    setIsPlaying(false);
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      // Jika sudah ada videoId, langsung putar. Jika belum, cari dulu.
      if (youtubeVideoId) {
        playerRef.current?.playVideo();
        setIsPlaying(true);
      } else {
        handlePlay();
      }
    }
  };
  
  // Event handler untuk YouTube Player
  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    playerRef.current.playVideo();
  };

  const onPlayerStateChange = (event: any) => {
    // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
    if (event.data === 0) { // Jika lagu selesai (ended)
      setIsPlaying(false);
    }
  };
  
  const onPlayerError = (event: any) => {
    console.error("YouTube Player Error:", event.data);
    setIsPlaying(false);
    setToastMessage("Gagal memutar video.");
  };

  // Fungsi playlist (tidak ada perubahan)
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
        {/* Header (tidak ada perubahan) */}
        <div className="w-full h-[35vh] md:h-[40vh] p-4 md:p-8 flex items-end gap-4 md:gap-6 bg-gradient-to-b from-primary/80 to-zinc-900">
          <div className="flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={track.name}
                width={232}
                height={232}
                className="w-36 h-36 md:w-56 md:h-56 rounded-md object-cover shadow-2xl shadow-black/50"
                priority
              />
            ) : (
                <div className="w-36 h-36 md:w-56 md:h-56 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500">
                  <Music4 size={64} />
                </div>
            )}
          </div>
          <div className="flex flex-col gap-2 md:gap-4 overflow-hidden">
            <span className="text-xs md:text-sm font-bold uppercase">Lagu</span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black truncate" title={track.name}>
              {track.name || "Judul Tidak Diketahui"}
            </h1>
            <p className="text-sm md:text-base text-zinc-300 truncate">
              {track.artists?.map((artist) => artist.name).join(", ") || "Artis Tidak Diketahui"}
            </p>
          </div>
        </div>

        {/* Kontrol Player (sudah diperbarui) */}
        <div className="p-4 md:p-8 flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <button
              onClick={togglePlayPause}
              disabled={isLoadingSong}
              className="bg-primary rounded-full p-4 text-white disabled:bg-zinc-700 disabled:cursor-not-allowed hover:scale-105 transition-transform flex items-center justify-center w-20 h-20"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoadingSong ? (
                <LoaderCircle size={32} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={32} className="fill-white" />
              ) : (
                <Play size={32} className="fill-white ml-1" />
              )}
            </button>
            <button
              onClick={handlePlaylistToggle}
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label={isInPlaylist ? "Hapus dari playlist" : "Tambahkan ke playlist"}
            >
              {isInPlaylist ? <Check size={32} className="text-primary" /> : <Plus size={32} />}
            </button>
          </div>
          
          {/* Kita hapus progress bar dan audio player lama */}
          {/* Player YouTube akan di-render secara kondisional di bawah */}
          
        </div>
      </main>

      {/* Render YouTubePlayer di sini */}
      <YouTubePlayer
        videoId={youtubeVideoId}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        onError={onPlayerError}
      />
      
      {/* Notifikasi kustom */}
      <Toast message={toastMessage} show={!!toastMessage} />
    </>
  );
}