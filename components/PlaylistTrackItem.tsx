// components/PlaylistTrackItem.tsx
"use client";

import { Track } from "@/types";
import Image from "next/image";
import Link from 'next/link';
import { Play, Pause, LoaderCircle, X } from 'lucide-react';
import { usePlayer } from "@/app/context/PlayerContext";

interface PlaylistTrackItemProps {
  track: Track;
  onPlay: () => void;
  onRemove: () => void; // Fungsi untuk menghapus
}

export default function PlaylistTrackItem({ track, onPlay, onRemove }: PlaylistTrackItemProps) {
  const { activeTrack, isPlaying, isLoading } = usePlayer();
  const isCurrentTrack = activeTrack?.id === track.id;
  const imageUrl = track.album.images?.[0]?.url;

  return (
    <div className="flex items-center p-2 rounded-md hover:bg-zinc-800 transition-colors group w-full">
      <Link href={`/track/${track.id}`} className="flex items-center flex-grow overflow-hidden">
        <div className="relative w-10 h-10 mr-4 flex-shrink-0">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPlay(); }}
            className="w-full h-full"
          >
              {imageUrl && <Image src={imageUrl} alt={track.name} fill className="object-cover rounded-md" />}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isLoading && isCurrentTrack ? <LoaderCircle size={24} className="text-white animate-spin" /> : isPlaying && isCurrentTrack ? <Pause size={24} className="text-white fill-white" /> : <Play size={24} className="text-white fill-white" />}
              </div>
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          <p className="text-white font-medium truncate">{track.name}</p>
          <p className="text-zinc-400 text-sm truncate">{track.artists.map((artist) => artist.name).join(", ")}</p>
        </div>
      </Link>
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="ml-4 p-2 text-zinc-400 hover:text-white"
        aria-label={`Hapus ${track.name} dari playlist`}
      >
        <X size={20} />
      </button>
    </div>
  );
}