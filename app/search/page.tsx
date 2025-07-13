// app/search/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, LoaderCircle } from 'lucide-react';
import { Track } from '@/types';
import { usePlayer } from '@/app/context/PlayerContext';
import TrackListItem from '@/components/TrackListItem';
import { TrackListSkeleton } from '@/components/TrackCardSkeleton';
import { useDebounce } from '@/hooks/useDebounce'; // Impor hook baru kita

const suggestedGenres = ["Pop", "Rock", "Indie", "Jazz", "Dangdut", "K-Pop", "Classical"];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const debouncedQuery = useDebounce(query, 400); // Terapkan debounce pada query
  const { playSong } = usePlayer();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Efek untuk melakukan pencarian setiap kali debouncedQuery berubah
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/spotify?q=${encodeURIComponent(debouncedQuery)}&type=track&limit=15`);
        const data = await res.json();
        setResults(data?.tracks?.items.filter((track: Track) => track.album?.images?.length > 0) || []);
      } catch (error) {
        console.error("Gagal melakukan pencarian:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Efek untuk menutup dropdown saat klik di luar area pencarian
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const showResultsPanel = isFocused && query.length > 0;
  const showSuggestionsPanel = isFocused && query.length === 0;

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      <div ref={searchContainerRef} className="relative max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Apa yang ingin kamu dengarkan?"
            className="w-full bg-zinc-800 text-white placeholder-zinc-400 rounded-full py-3 pl-12 pr-10 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
              <X size={20}/>
            </button>
          )}
        </div>
        
        {/* Panel Hasil Pencarian / Sugesti */}
        {(showResultsPanel || showSuggestionsPanel) && (
          <div className="absolute top-full mt-2 w-full bg-zinc-800 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto p-2">
            {showSuggestionsPanel && (
              <div>
                <h3 className="text-white font-bold p-2">Rekomendasi Genre</h3>
                <div className="flex flex-wrap gap-2 p-2">
                  {suggestedGenres.map(genre => (
                    <button key={genre} onClick={() => setQuery(genre)} className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold py-1 px-3 rounded-full transition">
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showResultsPanel && (
              isLoading ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 5 }).map((_, i) => <TrackListSkeleton key={i} />)}
                </div>
              ) : (
                results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((track, index) => (
                      <TrackListItem
                        key={track.id}
                        track={track}
                        onPlay={() => {
                          playSong(track, results, index);
                          setIsFocused(false); // Tutup panel setelah memilih lagu
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-center py-6 px-4">Tidak ada hasil ditemukan untuk &quot;{query}&quot;.</p>
                )
              )
            )}
          </div>
        )}
      </div>

      {!isFocused && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Cari Lagu Favoritmu.</h2>
          <p className="text-zinc-400 mt-2">Temukan jutaan lagu dan artis.</p>
        </div>
      )}
    </main>
  );
}