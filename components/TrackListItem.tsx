// components/TrackListItem.tsx
"use client";

import { Track } from "@/types";
import Image from "next/image";
import Link from 'next/link';
import { Play, Pause, LoaderCircle } from 'lucide-react';
import { usePlayer } from "@/app/context/PlayerContext";

interface TrackListItemProps {
  track: Track;
  onPlay: () => void;
}

export default function TrackListItem({ track, onPlay }: TrackListItemProps) {
  const { activeTrack, isPlaying, isLoading } = usePlayer();
  const isCurrentTrack = activeTrack?.id === track.id;
  const imageUrl = track.album.images?.[0]?.url;

  return (
    <Link href={`/track/${track.id}`} className="flex items-center p-2 rounded-md hover:bg-zinc-800 transition-colors group cursor-pointer">
      <div className="relative w-10 h-10 mr-4 flex-shrink-0">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPlay(); }}
          className="w-full h-full relative"
        >
            {imageUrl && <Image src={imageUrl} alt={track.name} fill className="object-cover rounded-md" />}
            {/* Spotify-style play button overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center rounded-md transition-all duration-300">
                {isLoading && isCurrentTrack ? (
                  <LoaderCircle size={20} className="text-white animate-spin" />
                ) : isPlaying && isCurrentTrack ? (
                  <div className="bg-primary hover:bg-primary/90 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <Pause size={12} className="fill-current" />
                  </div>
                ) : (
                  <div className="bg-primary hover:bg-primary/90 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <Play size={12} className="fill-current ml-0.5" />
                  </div>
                )}
            </div>
        </button>
      </div>
      <div className="flex-grow overflow-hidden">
        <p className="text-white font-medium truncate group-hover:text-white transition-colors">{track.name}</p>
        <p className="text-zinc-400 text-sm truncate group-hover:text-zinc-300 transition-colors">{track.artists.map((artist) => artist.name).join(", ")}</p>
      </div>
    </Link>
  );
}