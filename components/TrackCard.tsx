// components/TrackCard.tsx
import { Track } from "@/types";
import { Play, Pause } from "lucide-react";
import { event } from "./GoogleAnalytics";

interface TrackCardProps {
  track: Track;
  onPlay: () => void;
}

export default function TrackCard({ track, onPlay }: TrackCardProps) {
  const handlePlay = () => {
    // Track play event
    event({
      action: 'play_song',
      category: 'music',
      label: `${track.name} - ${track.artists?.[0]?.name || 'Unknown Artist'}`,
      value: 1
    });
    onPlay();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group">
      <div className="relative mb-4">
        <img
          src={track.album?.images?.[0]?.url || '/spotify-logo.png'}
          alt={track.name}
          className="w-full aspect-square object-cover rounded-md"
        />
        <button
          onClick={handlePlay}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md"
        >
          <Play className="text-white w-8 h-8" fill="white" />
        </button>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate" title={track.name}>
          {track.name}
        </h3>
        <p className="text-gray-400 text-sm truncate" title={track.artists?.[0]?.name}>
          {track.artists?.[0]?.name || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
}