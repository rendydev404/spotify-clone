"use client";

import { useState, useEffect } from "react";
import TrackCard from "@/components/TrackCard";
import { TrackCardSkeleton } from "@/components/TrackCardSkeleton";
import { Track } from "@/types";
import { usePlayer } from "@/app/context/PlayerContext";
import { Search, Music } from "lucide-react";
import { event } from "@/components/GoogleAnalytics";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playSong } = usePlayer();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setTracks([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/spotify?q=${encodeURIComponent(searchQuery)}&type=track&limit=20`);
      const data = await response.json();
      
      if (data.tracks?.items) {
        setTracks(data.tracks.items);
        
        // Track search event
        event({
          action: 'search_music',
          category: 'search',
          label: searchQuery,
          value: data.tracks.items.length
        });
      }
    } catch (error) {
      console.error("Error searching tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const TracksGrid = ({ tracks }: { tracks: Track[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {tracks.map((track, index) => (
        <TrackCard
          key={`${track.id}-${index}`}
          track={track}
          onPlay={() => playSong(track, tracks, index)}
        />
      ))}
    </div>
  );
  
  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
       {Array.from({ length: 12 }).map((_, i) => <TrackCardSkeleton key={i} />)}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Search className="text-primary" />
          Cari Musik
        </h1>
        <p className="text-gray-400">Temukan lagu favorit Anda</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari lagu, artis, atau album..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Hasil Pencarian untuk "{query}"
          </h2>
          {isLoading ? <SkeletonGrid /> : <TracksGrid tracks={tracks} />}
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            Mulai Pencarian
          </h3>
          <p className="text-gray-500">
            Ketik nama lagu, artis, atau album untuk mulai mencari
          </p>
        </div>
      )}
    </div>
  );
}