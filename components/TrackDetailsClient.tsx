// components/TrackDetailsClient.tsx
"use client";

import { Track } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Play, Pause, Plus, Check, Music4, LoaderCircle } from "lucide-react";
import { usePlayer } from "@/app/context/PlayerContext";
import TrackListItem from './TrackListItem';
import { TrackListSkeleton } from './TrackCardSkeleton';

const Toast = ({ message, show }: { message: string, show: boolean }) => ( <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 bg-zinc-800 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>{message}</div> );

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
        <div className="w-full p-4 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 bg-gradient-to-b from-primary/80 to-zinc-900">
          <div className="flex-shrink-0">
            {imageUrl ? <Image src={imageUrl} alt={track.name} width={232} height={232} className="w-48 h-48 md:w-56 md:h-56 rounded-md object-cover shadow-2xl" priority /> : <div className="w-48 h-48 md:w-56 md:h-56 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500"><Music4 size={64} /></div>}
          </div>
          <div className="flex flex-col gap-2 md:gap-4 overflow-hidden text-center md:text-left">
            <span className="text-sm font-bold uppercase">Lagu</span>
            <h1 className="text-4xl md:text-5xl font-black truncate" title={track.name}>{track.name || "Judul Tidak Diketahui"}</h1>
            <p className="text-base text-zinc-300 truncate">{track.artists?.map((artist) => artist.name).join(", ") || "Artis Tidak Diketahui"}</p>
          </div>
        </div>

        <div className="p-4 md:p-8 flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <button onClick={handlePlayClick} disabled={isLoading && isCurrentTrack} className="bg-primary rounded-full p-4 text-white hover:scale-105 transition-transform flex items-center justify-center w-20 h-20">{isLoading && isCurrentTrack ? <LoaderCircle size={32} className="animate-spin" /> : isPlaying && isCurrentTrack ? <Pause size={32} className="fill-white" /> : <Play size={32} className="fill-white ml-1" />}</button>
            <button onClick={handlePlaylistToggle} className="text-zinc-400 hover:text-white transition-colors">{isInPlaylist ? <Check size={32} className="text-primary" /> : <Plus size={32} />}</button>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Rekomendasi</h2>
            <div className="space-y-2">
                {isLoadingRecs ? Array.from({ length: 5 }).map((_, i) => <TrackListSkeleton key={i} />) : 
                recommendations.map((rec, index) => (
                    <TrackListItem key={rec.id} track={rec} onPlay={() => playSong(rec, [track, ...recommendations], index + 1)} />
                ))}
            </div>
          </div>
        </div>
      </main>
      <Toast message={toastMessage} show={!!toastMessage} />
    </>
  );
}