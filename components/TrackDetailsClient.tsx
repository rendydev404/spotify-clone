"use client";

import { Track } from "@/types";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Plus, Check, Music4 } from "lucide-react";

// Komponen Notifikasi Kustom (Toast) - Pengganti alert()
const Toast = ({ message, show }: { message: string, show: boolean }) => {
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-zinc-800 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
      {message}
    </div>
  );
};

export default function TrackDetailsClient({ track }: { track: Track }) {
  // State untuk mengelola audio player
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // State untuk mengelola playlist
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  
  // State untuk notifikasi kustom
  const [toastMessage, setToastMessage] = useState("");

  // Cek status playlist saat komponen pertama kali dimuat
  useEffect(() => {
    const existingPlaylist: Track[] = JSON.parse(localStorage.getItem('my-playlist') || '[]');
    setIsInPlaylist(existingPlaylist.some(item => item.id === track.id));
  }, [track.id]);

  // Efek untuk menampilkan dan menyembunyikan notifikasi
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000); // Sembunyikan setelah 3 detik
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Fungsi untuk play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Fungsi untuk menambah/menghapus dari playlist
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
  
  // Fungsi untuk memformat waktu dari detik ke menit:detik
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const imageUrl = track.album.images?.[0]?.url;

  return (
    <>
      <main className="bg-zinc-900 text-white min-h-screen">
        {/* BAGIAN HEADER/BANNER - Responsif */}
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

        {/* BAGIAN KONTEN & KONTROL - Responsif */}
        <div className="p-4 md:p-8 flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <button
              onClick={togglePlayPause}
              disabled={!track.preview_url}
              className="bg-primary rounded-full p-4 text-white disabled:bg-zinc-700 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={32} className="fill-white" /> : <Play size={32} className="fill-white ml-1" />}
            </button>
            <button
              onClick={handlePlaylistToggle}
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label={isInPlaylist ? "Hapus dari playlist" : "Tambahkan ke playlist"}
            >
              {isInPlaylist ? <Check size={32} className="text-primary" /> : <Plus size={32} />}
            </button>
          </div>

          {/* Audio Player & Progress Bar Kustom */}
          {track.preview_url ? (
            <div className="w-full max-w-md">
              <audio
                ref={audioRef}
                src={track.preview_url}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onEnded={() => {
                  setIsPlaying(false);
                  setCurrentTime(0); // Reset ke awal saat selesai
                }}
              />
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>{formatTime(currentTime)}</span>
                <div className="w-full bg-zinc-700 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full" 
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          ) : (
            <p className="text-zinc-400">Preview tidak tersedia untuk lagu ini.</p>
          )}
        </div>
      </main>
      {/* Notifikasi kustom akan muncul di sini */}
      <Toast message={toastMessage} show={!!toastMessage} />
    </>
  );
}
