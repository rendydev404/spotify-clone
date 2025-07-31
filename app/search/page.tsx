"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Music } from 'lucide-react';
import { Track } from '@/types';
import { usePlayer } from '@/app/context/PlayerContext';
import TrackListItem from '@/components/TrackListItem';
import { TrackListSkeleton } from '@/components/TrackCardSkeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { useAnalytics } from '@/hooks/useAnalytics';

const suggestedGenres = ["Pop", "Rock", "Indie", "Jazz", "Dangdut", "K-Pop", "Classical"];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedQuery = useDebounce(query, 400);
  const { playSong } = usePlayer();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { trackEvent, trackSearch } = useAnalytics();

  // Efek untuk membersihkan state pencarian saat komponen unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fungsi untuk melakukan pencarian
  const performSearch = async (searchQuery: string) => {
    try {
      // Batalkan request sebelumnya jika ada
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Buat controller baru untuk request ini
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      const res = await fetch(
        `/api/spotify?q=${encodeURIComponent(searchQuery)}&type=track&limit=15`,
        { signal: abortControllerRef.current.signal }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await res.json();

      // Validasi data response
      if (!data || !data.tracks || !Array.isArray(data.tracks.items)) {
        throw new Error('Invalid response format');
      }

      // Filter dan validasi tracks
      const validTracks = data.tracks.items.filter((track: Track) => {
        return track && 
               track.id &&
               track.name &&
               track.album &&
               Array.isArray(track.album.images) &&
               track.album.images.length > 0;
      });

      setResults(validTracks);
      
      // Track search analytics dalam try-catch terpisah
      try {
        trackSearch(searchQuery, validTracks.length);
      } catch (analyticsError) {
        console.error("Analytics error:", analyticsError);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Abaikan error abort karena ini normal saat membatalkan request
          return;
        }
        setError(err.message);
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect untuk menangani pencarian
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      setError(null);
      return;
    }

    performSearch(debouncedQuery.trim());
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

  const handlePlaySong = (track: Track, tracks: Track[], index: number) => {
    try {
      // Track to analytics dashboard only if track is valid
      if (track?.name) {
        try {
          trackEvent('play_song', { 
            song: `${track.name} - ${track.artists?.[0]?.name || 'Unknown Artist'}`,
            source: 'search'
          });
        } catch (analyticsError) {
          console.error("Analytics error:", analyticsError);
        }
      }
      
      // Play the song
      playSong(track, tracks, index);
      setIsFocused(false); // Tutup panel setelah memilih lagu
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Search className="text-primary" />
          Cari Musik
        </h1>
        <p className="text-gray-400">Temukan lagu favorit Anda</p>
      </div>

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
                error ? (
                  <p className="text-red-400 text-center py-6 px-4">
                    Terjadi kesalahan: {error}. Silakan coba lagi.
                  </p>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((track, index) => (
                      <TrackListItem
                        key={track.id}
                        track={track}
                        onPlay={() => handlePlaySong(track, results, index)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-center py-6 px-4">
                    Tidak ada hasil ditemukan untuk &quot;{query}&quot;.
                  </p>
                )
              )
            )}
          </div>
        )}
      </div>

      {!isFocused && (
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
    </main>
  );
}