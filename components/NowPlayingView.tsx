// components/NowPlayingView.tsx
"use client";

import { usePlayer } from '@/app/context/PlayerContext';
import Image from 'next/image';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, LoaderCircle, Mic2, Music } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

// Tipe untuk baris lirik
interface LyricLine {
  time: number;
  text: string;
}
const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
// Komponen untuk menampilkan status lirik (Loading, Not Found, etc)
const LyricsStatus = ({ icon: Icon, title, message }: { icon: React.ElementType, title: string, message?: string }) => (
    <div className="flex flex-col items-center justify-center text-center text-zinc-400 h-full">
        <Icon size={48} className="opacity-50" />
        <p className="mt-4 text-xl font-bold text-white">{title}</p>
        {message && <p className="text-sm text-zinc-500">{message}</p>}
    </div>
);


export default function NowPlayingView() {
    const { 
        activeTrack, isPlaying, isLoading, progress, duration, repeatMode,
        togglePlayPause, seek, playNext, playPrevious, toggleRepeatMode, closeNowPlayingView 
    } = usePlayer();

    const [lyrics, setLyrics] = useState<LyricLine[] | null>(null);
    const [lyricsMessage, setLyricsMessage] = useState<string | null>(null);
    const [isLoadingLyrics, setIsLoadingLyrics] = useState(true);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    
    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    
    // 1. Ambil lirik tersinkronisasi
    useEffect(() => {
        if (activeTrack && duration > 0) {
            setIsLoadingLyrics(true);
            setLyrics(null);
            setLyricsMessage(null);
            lineRefs.current = [];

            const fetchSyncedLyrics = async () => {
                try {
                    const res = await fetch(`/api/synced-lyrics?artist=${encodeURIComponent(activeTrack.artists[0].name)}&title=${encodeURIComponent(activeTrack.name)}&duration=${Math.round(duration)}`);
                    const data = await res.json();
                    if (data.lyrics && data.lyrics.length > 0) {
                        setLyrics(data.lyrics);
                        lineRefs.current = Array(data.lyrics.length).fill(null);
                    } else {
                        setLyricsMessage(data.message || "Lirik tidak tersedia.");
                    }
                } catch (error) {
                    setLyricsMessage("Gagal memuat lirik.");
                } finally {
                    setIsLoadingLyrics(false);
                }
            };
            // Delay sedikit untuk memberi waktu YouTube Player siap
            setTimeout(fetchSyncedLyrics, 300);
        }
    }, [activeTrack, duration]);

    // 2. Logika Sempurna untuk Sinkronisasi Lirik
    useEffect(() => {
        if (!lyrics) return;
        
        let newIndex = -1;
        // Cari baris terakhir yang waktunya sudah terlewat
        for (let i = 0; i < lyrics.length; i++) {
            if (progress >= lyrics[i].time) {
                newIndex = i;
            } else {
                break;
            }
        }

        if (newIndex !== currentLineIndex) {
            setCurrentLineIndex(newIndex);
        }
    }, [progress, lyrics, currentLineIndex]);
    
    // 3. Auto-scroll yang Halus
    useEffect(() => {
        if (currentLineIndex > -1 && lineRefs.current[currentLineIndex]) {
            lineRefs.current[currentLineIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentLineIndex]);

    if (!activeTrack) return null;

    const imageUrl = activeTrack.album.images?.[0]?.url;
    const progressPercentage = duration ? (progress / duration) * 100 : 0;
    const sliderStyle = { background: `linear-gradient(to right, #fff ${progressPercentage}%, #ffffff40 ${progressPercentage}%)`};

    const isIntro = currentLineIndex === -1 && lyrics && lyrics.length > 0;
    
    return (
        <div className="fixed inset-0 bg-zinc-900 z-50 flex flex-col overflow-hidden">
             {/* Latar Belakang Estetik Dinamis */}
            {imageUrl && <Image src={imageUrl} alt="" fill className="object-cover opacity-20 blur-3xl scale-125 transition-all duration-1000" />}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10" />

            <div className="relative z-20 flex flex-col h-full p-4 md:p-6 text-white">
                {/* Header */}
                <div className="flex justify-between items-center flex-shrink-0">
                     <button onClick={closeNowPlayingView} className="p-2"><ChevronDown size={28} /></button>
                     <p className="font-bold truncate">{activeTrack.album.name}</p>
                     <div className="w-10" />
                </div>

                {/* Kontainer Lirik Utama */}
                <div 
                  ref={lyricsContainerRef}
                  className="flex-grow w-full overflow-y-auto my-4 
                             [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]
                             scrollbar-hide"
                >
                    <div className="flex flex-col justify-start min-h-full py-[45vh] gap-6">
                      {isLoadingLyrics ? <LyricsStatus icon={LoaderCircle} title="Mencari Lirik..." />
                      : lyrics ? (
                          lyrics.map((line, index) => (
                              <p
                                  key={`${line.time}-${index}`}
                                  ref={el => { if(el) lineRefs.current[index] = el; }}
                                  className={`
                                      w-full text-left text-3xl md:text-4xl font-bold transition-all duration-500 ease-in-out
                                      py-1
                                      ${currentLineIndex === index ? 'text-white opacity-100' : 'text-zinc-400 opacity-50'}
                                  `}
                              >
                                  {line.text}
                              </p>
                          ))
                      ) : ( isIntro ? 
                            <LyricsStatus icon={Mic2} title="Menunggu bagian vokal..." />
                            : <LyricsStatus icon={Music} title={lyricsMessage || "Lirik tidak tersedia."} />
                      )}
                    </div>
                </div>

                {/* Footer Kontrol */}
                <div className="flex-shrink-0">
                    <div className="flex items-center gap-4 mb-4">
                        {imageUrl && <Image src={imageUrl} alt={activeTrack.name} width={56} height={56} className="rounded-md shadow-lg" />}
                        <div className="overflow-hidden">
                            <h2 className="text-xl font-bold truncate">{activeTrack.name}</h2>
                            <p className="text-sm text-zinc-300 truncate">{activeTrack.artists.map(a => a.name).join(', ')}</p>
                        </div>
                    </div>
                    <div className="w-full mb-1">
                        <input type="range" min="0" max={duration || 0} value={progress} onChange={(e) => seek(Number(e.target.value))} style={sliderStyle}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none" />
                        <div className="flex justify-between text-xs text-zinc-400 mt-1">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <button onClick={toggleRepeatMode} className="w-12 h-12 flex items-center justify-center">
                            <Repeat1 size={20} className={repeatMode === 'one' ? 'text-primary' : 'hidden'} /><Repeat size={20} className={repeatMode !== 'one' ? (repeatMode === 'all' ? 'text-primary' : '') : 'hidden'} />
                        </button>
                        <div className="flex items-center gap-4">
                            <button onClick={playPrevious}><SkipBack size={36} className="fill-current" /></button>
                            <button onClick={togglePlayPause} className="bg-white text-black rounded-full p-4 w-20 h-20 flex items-center justify-center">
                                {isLoading ? <LoaderCircle size={36} className="animate-spin" /> : isPlaying ? <Pause size={36} className="fill-black" /> : <Play size={36} className="fill-black ml-1" />}
                            </button>
                            <button onClick={playNext}><SkipForward size={36} className="fill-current" /></button>
                        </div>
                        <div className="w-12 h-12" />
                    </div>
                </div>
            </div>
        </div>
    );
}