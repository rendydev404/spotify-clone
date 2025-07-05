// components/TrackCard.tsx
import { Track } from "@/types";
import Image from "next/image";
import Link from 'next/link';
import { Play } from 'lucide-react';

interface TrackCardProps {
  track: Track;
  onPlay: () => void; // Tambahkan prop onPlay
}

export default function TrackCard({ track, onPlay }: TrackCardProps) {
  const imageUrl = track.album.images?.[0]?.url;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah navigasi saat tombol play diklik
    e.stopPropagation();
    onPlay();
  };

  return (
    <Link href={`/track/${track.id}`} className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors group cursor-pointer relative">
        <div className="relative w-full aspect-square mb-4">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={track.name}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}
          {/* Tombol Play yang Muncul Saat Hover */}
          <button
            onClick={handlePlayClick}
            className="absolute bottom-2 right-2 bg-primary p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300"
            aria-label={`Play ${track.name}`}
          >
            <Play className="fill-white text-white ml-0.5" />
          </button>
        </div>
        <h3 className="font-bold truncate text-white">{track.name}</h3>
        <p className="text-sm text-zinc-400 truncate">
          {track.artists.map((artist) => artist.name).join(", ")}
        </p>
    </Link>
  );
}