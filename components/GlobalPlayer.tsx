// components/GlobalPlayer.tsx
"use client";

import Image from 'next/image';
import { usePlayer } from '@/app/context/PlayerContext';
import { Play, Pause, LoaderCircle, SkipBack, SkipForward, Repeat, Repeat1 } from 'lucide-react';

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function GlobalPlayer() {
  const {
    activeTrack, isPlaying, isLoading, progress, duration, openNowPlayingView,
    togglePlayPause, seek, playNext, playPrevious, repeatMode, toggleRepeatMode
  } = usePlayer();

  if (!activeTrack) return null;
  const imageUrl = activeTrack.album.images?.[0]?.url;

  return (
    // Wrapper yang bisa di-klik di mobile
    <div onClick={openNowPlayingView} className="md:pointer-events-none fixed bottom-16 md:bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 text-white flex items-center px-4 z-40">
      <div className="w-full flex items-center justify-between md:justify-center">
        {/* Mobile & Desktop: Track Info */}
        <div className="flex items-center gap-3 w-full md:w-1/4 md:justify-start pointer-events-auto">
          {imageUrl && <Image src={imageUrl} alt={activeTrack.name} width={56} height={56} className="rounded-md" />}
          <div>
            <p className="font-semibold truncate text-sm md:text-base">{activeTrack.name}</p>
            <p className="text-xs text-zinc-400 truncate">{activeTrack.artists.map(a => a.name).join(', ')}</p>
          </div>
        </div>

        {/* Desktop: Player Controls & Progress Bar */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-4">
                <button onClick={toggleRepeatMode} className="text-zinc-400 hover:text-white"><Repeat1 className={repeatMode === 'one' ? 'text-primary' : 'hidden'} /><Repeat className={repeatMode !== 'one' ? (repeatMode === 'all' ? 'text-primary' : '') : 'hidden'} /></button>
                <button onClick={playPrevious} className="text-zinc-400 hover:text-white"><SkipBack /></button>
                <button onClick={togglePlayPause} className="bg-white text-black rounded-full p-2 hover:scale-105">{isLoading ? <LoaderCircle size={24} className="animate-spin" /> : isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black ml-1" />}</button>
                <button onClick={playNext} className="text-zinc-400 hover:text-white"><SkipForward /></button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-lg">
                <span className="text-xs text-zinc-400">{formatTime(progress)}</span>
                <input type="range" min="0" max={duration || 0} value={progress} onChange={(e) => seek(Number(e.target.value))} className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full" />
                <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
            </div>
        </div>
        
        {/* Mobile: Play/Pause button */}
        <div className="md:hidden pointer-events-auto">
             <button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="p-2">{isPlaying ? <Pause size={32} className="fill-white"/> : <Play size={32} className="fill-white"/>}</button>
        </div>
      </div>
    </div>
  );
}