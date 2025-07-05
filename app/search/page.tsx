// app/search/page.tsx
"use client";

import { useState, FormEvent } from 'react'; // Hapus useEffect yang tidak digunakan
import { Search } from 'lucide-react';
import { Track } from '@/types';
import { usePlayer } from '@/app/context/PlayerContext';
import TrackListItem from '@/components/TrackListItem';
import { TrackListSkeleton } from '@/components/TrackCardSkeleton';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { playSong } = usePlayer();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/spotify?q=${encodeURIComponent(query)}&type=track`);
      const data = await res.json();
      setResults(data?.tracks?.items.filter((track: Track) => track.album?.images?.length > 0) || []);
    } catch (error) {
      console.error("Gagal melakukan pencarian:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      <div className="mb-8">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari lagu atau artis..."
              className="w-full bg-zinc-800 text-white placeholder-zinc-400 rounded-full py-3 pl-12 pr-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </form>
      </div>

      <div>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => <TrackListSkeleton key={i} />)}
          </div>
        ) : hasSearched ? (
          results.length > 0 ? (
            <div className="space-y-2">
              {results.map((track, index) => (
                <TrackListItem
                  key={track.id}
                  track={track}
                  onPlay={() => playSong(track, results, index)}
                />
              ))}
            </div>
          ) : (
            // Perbaiki kutip dua di sini
            <p className="text-zinc-400 text-center py-10">Tidak ada hasil ditemukan untuk &quot;{query}&quot;.</p>
          )
        ) : (
            <p className="text-zinc-400 text-center py-10">Cari lagu favoritmu.</p>
        )}
      </div>
    </main>
  );
}