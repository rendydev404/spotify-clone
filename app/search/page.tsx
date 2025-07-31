"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Music } from 'lucide-react';
import { Track } from '@/types';
import { usePlayer } from '@/app/context/PlayerContext';
import TrackListItem from '@/components/TrackListItem';
import { TrackListSkeleton } from '@/components/TrackCardSkeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { event } from '@/components/GoogleAnalytics';
import { useAnalytics } from '@/hooks/useAnalytics';

const suggestedGenres = ["Pop", "Rock", "Indie", "Jazz", "Dangdut", "K-Pop", "Classical"];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const debouncedQuery = useDebounce(query, 400);
  const { playSong } = usePlayer();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { trackEvent, trackSearch } = useAnalytics();

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
        const filteredResults = data?.tracks?.items.filter((track: Track) => track.album?.images?.length > 0) || [];
        setResults(filteredResults);
        
        // Track search analytics
        event({
          action: 'search_music',
          category: 'search',
          label: debouncedQuery,
          value: filteredResults.length
        });
        
        // Track to analytics dashboard
        trackSearch(debouncedQuery, filteredResults.length);
      } catch (error) {
        console.error("Gagal melakukan pencarian:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, trackSearch]);

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
    // Track to Google Analytics
    event({
      action: 'play_song',
      category: 'music',
      label: `${track.name} - ${track.artists?.[0]?.name || 'Unknown Artist'}`,
      value: 1
    });
    
    // Track to analytics dashboard
    trackEvent('play_song', { 
      song: `${track.name} - ${track.artists?.[0]?.name || 'Unknown Artist'}`,
      source: 'search'
    });
    
    // Play the song
    playSong(track, tracks, index);
    setIsFocused(false); // Tutup panel setelah memilih lagu
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
                results.length > 0 ? (
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
                  <p className="text-zinc-400 text-center py-6 px-4">Tidak ada hasil ditemukan untuk &quot;{query}&quot;.</p>
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