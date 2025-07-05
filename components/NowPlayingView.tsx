// components/NowPlayingView.tsx
"use client";

import { usePlayer } from '@/app/context/PlayerContext';
import Image from 'next/image';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, LoaderCircle } from 'lucide-react';

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function NowPlayingView() {
    const { 
        activeTrack, isPlaying, isLoading, progress, duration, repeatMode,
        togglePlayPause, seek, playNext, playPrevious, toggleRepeatMode, closeNowPlayingView 
    } = usePlayer();

    if (!activeTrack) return null;

    const imageUrl = activeTrack.album.images?.[0]?.url;

    return (
        <div className="fixed inset-0 bg-zinc-900 z-50 flex flex-col p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={closeNowPlayingView} className="p-2">
                    <ChevronDown size={28} />
                </button>
                <span className="text-sm font-bold uppercase">Now Playing</span>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Album Art */}
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-sm aspect-square relative">
                    {imageUrl && (
                        <Image src={imageUrl} alt={activeTrack.name} fill className="object-cover rounded-lg shadow-2xl" />
                    )}
                </div>
            </div>
            
            {/* Track Info & Progress */}
            <div className="flex-shrink-0">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold truncate">{activeTrack.name}</h2>
                    <p className="text-base text-zinc-400 truncate">{activeTrack.artists.map(a => a.name).join(', ')}</p>
                </div>

                <div className="flex items-center gap-2 w-full text-xs text-zinc-400 mb-2">
                    <span>{formatTime(progress)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={progress}
                        onChange={(e) => seek(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex justify-around items-center">
                    <button onClick={toggleRepeatMode} className="text-zinc-400 hover:text-white">
                        {repeatMode === 'one' ? <Repeat1 size={20} className="text-primary" /> : <Repeat size={20} className={repeatMode === 'all' ? 'text-primary' : ''} />}
                    </button>
                    <button onClick={playPrevious} className="text-zinc-300 hover:text-white">
                        <SkipBack size={32} className="fill-current" />
                    </button>
                    <button onClick={togglePlayPause} className="bg-white text-black rounded-full p-4 hover:scale-105">
                        {isLoading ? <LoaderCircle size={32} className="animate-spin" /> : isPlaying ? <Pause size={32} className="fill-black" /> : <Play size={32} className="fill-black ml-1" />}
                    </button>
                    <button onClick={playNext} className="text-zinc-300 hover:text-white">
                        <SkipForward size={32} className="fill-current" />
                    </button>
                    <div className="w-8"></div> {/* Spacer */}
                </div>
            </div>
        </div>
    );
}
