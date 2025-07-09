// app/context/PlayerContext.tsx
"use client";

import { createContext, useState, useContext, useRef, useEffect, ReactNode } from 'react';
import { Track } from '@/types';
import { searchYouTubeForSong } from '@/lib/youtube';
import YouTubePlayer from '@/components/YouTubePlayer';
import NowPlayingView from '@/components/NowPlayingView';

type RepeatMode = 'none' | 'one' | 'all';

// Tipe spesifik untuk event dan instance dari YouTube Player
export interface YouTubeEvent {
  target: any;
  data: number;
}
interface PlayerInstance {
  getCurrentTime: () => number;
  getDuration: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (time: number, allowSeekAhead?: boolean) => void;
}

interface PlayerContextType {
  activeTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  repeatMode: RepeatMode;
  isNowPlayingViewOpen: boolean;
  playSong: (track: Track, queue?: Track[], index?: number) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleRepeatMode: () => void;
  seek: (time: number) => void;
  openNowPlayingView: () => void;
  closeNowPlayingView: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [isNowPlayingViewOpen, setNowPlayingViewOpen] = useState(false);

  const playerRef = useRef<PlayerInstance | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Fungsi untuk memulai timer progress bar (tidak berubah)
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (playerRef.current) {
        setProgress(playerRef.current.getCurrentTime() || 0);
      }
    }, 1000);
  };
  const stopTimer = () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  useEffect(() => { return () => stopTimer(); }, []);

  // Fungsi untuk memuat dan memainkan lagu dari YouTube (tidak berubah)
  const loadAndPlaySong = async (track: Track) => {
    setIsLoading(true);
    setIsPlaying(false);
    setActiveTrack(track);
    setYoutubeVideoId(null);
    const videoId = await searchYouTubeForSong(track.name, track.artists[0]?.name || '');
    setIsLoading(false);
    if (videoId) {
      setYoutubeVideoId(videoId);
      setIsPlaying(true);
    } else {
      alert("Maaf, lagu tidak dapat ditemukan. Memainkan lagu berikutnya.");
      playNext();
    }
  };

  // Fungsi untuk memulai lagu dari daftar putar (tidak berubah)
  const playSong = (track: Track, newQueue: Track[] = [track], index: number = 0) => {
    if (activeTrack?.id === track.id) {
        togglePlayPause();
        return;
    }
    setQueue(newQueue);
    setCurrentIndex(index);
    loadAndPlaySong(track);
  };

  // Fungsi untuk memainkan lagu berikutnya (tidak berubah)
  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1);
    if (nextIndex >= queue.length && repeatMode !== 'all') {
        setIsPlaying(false);
        setActiveTrack(null);
        setYoutubeVideoId(null);
        return;
    }
    const finalIndex = nextIndex % queue.length;
    setCurrentIndex(finalIndex);
    loadAndPlaySong(queue[finalIndex]);
  };

  // Fungsi untuk memainkan lagu sebelumnya (tidak berubah)
  const playPrevious = () => {
    if (queue.length === 0) return;
    if (progress > 3) {
      playerRef.current?.seekTo(0);
      return;
    }
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    loadAndPlaySong(queue[prevIndex]);
  };

  // ✅ FUNGSI BARU: Memulai Radio Lagu
  const startRadio = async () => {
    if (!activeTrack || !activeTrack.artists[0]?.id) return; // Butuh ID artis untuk rekomendasi
    
    console.log(`Memulai Radio berdasarkan artis: ${activeTrack.artists[0].name}`);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/spotify?type=recommendations&seed_artists=${activeTrack.artists[0].id}&limit=10`);
      const data = await res.json();
      
      // Spotify mengembalikan 'tracks', bukan 'items' untuk rekomendasi
      const recommendedTracks = data.tracks || [];
      
      if (recommendedTracks.length > 0) {
        // Gabungkan antrean saat ini dengan lagu baru
        const newQueue = [...queue.slice(0, currentIndex + 1), ...recommendedTracks];
        setQueue(newQueue);
        // Langsung mainkan lagu berikutnya dari hasil rekomendasi
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        loadAndPlaySong(newQueue[nextIndex]);
      } else {
        // Jika tidak ada rekomendasi, hentikan pemutaran
        setIsPlaying(false);
        setActiveTrack(null);
      }
    } catch (error) {
      console.error("Gagal mengambil rekomendasi radio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Event handler saat state player berubah (sudah di-upgrade)
  const onPlayerStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) { // Playing
      setIsPlaying(true);
      if (playerRef.current) setDuration(playerRef.current.getDuration());
      startTimer();
    } else if (event.data === 2) { // Paused
      setIsPlaying(false);
      stopTimer();
    } else if (event.data === 0) { // Ended
      if (repeatMode === 'one') {
        playerRef.current?.seekTo(0);
      } else if (repeatMode === 'all' && currentIndex < queue.length - 1) {
        playNext();
      } else {
        // ✅ Jika lagu terakhir di antrean selesai, mulai radio!
        startRadio();
      }
    }
  };
  
  // Sisa fungsi (tidak berubah)
  const toggleRepeatMode = () => setRepeatMode(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none');
  const togglePlayPause = () => { if (isPlaying) playerRef.current?.pauseVideo(); else playerRef.current?.playVideo(); };
  const seek = (time: number) => { playerRef.current?.seekTo(time, true); };
  const openNowPlayingView = () => setNowPlayingViewOpen(true);
  const closeNowPlayingView = () => setNowPlayingViewOpen(false);
  const onPlayerReady = (event: YouTubeEvent) => { playerRef.current = event.target; };
  const onPlayerError = (event: YouTubeEvent) => { console.error("YouTube Player Error:", event.data); setIsPlaying(false); stopTimer(); };

  const value = {
    activeTrack, isPlaying, isLoading, progress, duration, repeatMode, isNowPlayingViewOpen,
    playSong, togglePlayPause, playNext, playPrevious, toggleRepeatMode, seek, openNowPlayingView, closeNowPlayingView,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {isNowPlayingViewOpen && <NowPlayingView />}
      <YouTubePlayer videoId={youtubeVideoId} onReady={onPlayerReady} onStateChange={onPlayerStateChange} onError={onPlayerError} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) throw new Error('usePlayer harus digunakan di dalam PlayerProvider');
  return context;
};