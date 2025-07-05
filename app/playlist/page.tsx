// Tambahkan ini di baris paling atas!
"use client";

import { useEffect, useState } from "react";
import { Track } from "@/types";
import Link from "next/link";
import TrackCard from "@/components/TrackCard";

export default function PlaylistPage() {
  const [playlist, setPlaylist] = useState<Track[]>([]);

  // useEffect akan berjalan saat komponen dimuat di browser
  useEffect(() => {
    const savedPlaylist: Track[] = JSON.parse(localStorage.getItem('my-playlist') || '[]');
    setPlaylist(savedPlaylist);
  }, []);

  const handleRemoveFromPlaylist = (trackId: string) => {
    const newPlaylist = playlist.filter(track => track.id !== trackId);
    setPlaylist(newPlaylist);
    localStorage.setItem('my-playlist', JSON.stringify(newPlaylist));
    alert("Lagu dihapus dari playlist.");
  };

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Playlist Saya
      </h1>
      {playlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlist.map((track) => (
            <div key={track.id} className="relative group">
              <Link href={`/track/${track.id}`}>
                <TrackCard track={track} />
              </Link>
              <button
                onClick={() => handleRemoveFromPlaylist(track.id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove from playlist"
              >
                X
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-400">Playlist Anda masih kosong.</p>
      )}
    </main>
  );
}