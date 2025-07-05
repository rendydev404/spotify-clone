"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from 'next/link';
import { Search } from 'lucide-react';

import TrackCard from "@/components/TrackCard";
import { Track } from "@/types";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [discoverTracks, setDiscoverTracks] = useState<Track[]>([]);
  const [searchResults, setSearchResults] = useState<Track[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ MENGAMBIL LAGU REKOMENDASI
  useEffect(() => {
    const getDiscoverTracks = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/spotify?q=tag:trends&type=track`);
        const data = await res.json();
        if (data && data.tracks && data.tracks.items.length > 0) {
          setDiscoverTracks(
            data.tracks.items.filter((track: Track) => track.album?.images?.length > 0)
          );
        } else {
          const fallbackRes = await fetch(`/api/spotify?q=genre:pop&type=track`);
          const fallbackData = await fallbackRes.json();
          setDiscoverTracks(
            fallbackData?.tracks?.items.filter((track: Track) => track.album?.images?.length > 0) || []
          );
        }
      } catch (error) {
        console.error("Gagal mengambil lagu rekomendasi:", error);
        setDiscoverTracks([]);
      } finally {
        setIsLoading(false);
      }
    };

    getDiscoverTracks();
  }, []);

  // ✅ HANDLE SEARCH KE API ROUTE
  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/spotify?q=${encodeURIComponent(searchQuery)}&type=track`);
      const data = await res.json();
      setSearchResults(
        data?.tracks?.items.filter((track: Track) => track.album?.images?.length > 0) || []
      );
    } catch (error) {
      console.error("Gagal melakukan pencarian:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ GRID KOMPONEN
  const TracksGrid = ({ tracks }: { tracks: Track[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {tracks.map((track) => (
        <Link href={`/track/${track.id}`} key={track.id}>
          <TrackCard track={track} />
        </Link>
      ))}
    </div>
  );

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      {/* SEARCH */}
      <div className="mb-8">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lagu atau artis..."
              className="w-full bg-zinc-800 text-white placeholder-zinc-400 rounded-full py-3 pl-12 pr-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </form>
      </div>

      {/* KONTEN */}
      {isLoading ? (
        <p className="text-zinc-400 text-center py-20">Memuat...</p>
      ) : searchResults !== null ? (
        <div>
          <h1 className="text-3xl font-bold text-white mb-8">
            Hasil untuk "{searchQuery}"
          </h1>
          {searchResults.length > 0 ? (
            <TracksGrid tracks={searchResults} />
          ) : (
            <p className="text-zinc-400">Tidak ada hasil ditemukan.</p>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Jelajahi Musik
          </h1>
          <p className="text-zinc-400 text-base mb-8">
            Lagu populer untukmu.
          </p>
          {discoverTracks.length > 0 ? (
            <TracksGrid tracks={discoverTracks} />
          ) : (
            <p className="text-zinc-400">Gagal memuat lagu rekomendasi.</p>
          )}
        </div>
      )}
    </main>
  );
}
