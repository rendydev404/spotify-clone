"use client";

import { Track } from "@/types";
import Image from "next/image";

export default function TrackDetailsClient({ track }: { track: Track }) {

  const handleAddToPlaylist = () => {
    // Fungsi ini tidak berubah
    const existingPlaylist: Track[] = JSON.parse(localStorage.getItem('my-playlist') || '[]');
    const isAlreadyInPlaylist = existingPlaylist.some(item => item.id === track.id);
    if (isAlreadyInPlaylist) {
      alert("Lagu sudah ada di playlist!");
      return;
    }
    const newPlaylist = [...existingPlaylist, track];
    localStorage.setItem('my-playlist', JSON.stringify(newPlaylist));
    alert("Lagu berhasil ditambahkan ke playlist!");
  };

  if (!track) {
    return <div className="text-white text-center p-10">Memuat data lagu...</div>;
  }

  const imageUrl = track.album.images?.[0]?.url;

  return (
    // Kita tidak lagi center semua, biarkan mengalir dari atas
    <main className="bg-zinc-900 text-white min-h-screen">
      {/* BAGIAN HEADER/BANNER */}
      <div className="h-80 p-8 flex items-end gap-6 bg-gradient-to-b from-purple-800 to-zinc-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={track.name}
            width={240} // Ukuran gambar dibuat lebih besar
            height={240}
            className="rounded-md object-cover shadow-2xl shadow-black/50"
            priority
          />
        ) : (
          <div className="w-60 h-60 bg-zinc-800 rounded-md flex-shrink-0" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-bold">Lagu</span>
          <h1 className="text-5xl md:text-7xl font-bold break-words">
            {track.name || "Judul Tidak Diketahui"}
          </h1>
          <p className="text-lg text-zinc-300 mt-4">
            {track.artists?.map((artist) => artist.name).join(", ") || "Artis Tidak Diketahui"}
          </p>
        </div>
      </div>

      {/* BAGIAN KONTEN & KONTROL */}
      <div className="p-8">
        <button
          onClick={handleAddToPlaylist}
          className="bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all"
        >
          Tambahkan ke Playlist
        </button>

        <div className="mt-10">
          <h2 className="font-bold text-xl mb-4">Preview</h2>
          {track.preview_url ? (
            <audio controls src={track.preview_url} className="w-full max-w-md" />
          ) : (
            <p className="text-zinc-400">Preview tidak tersedia.</p>
          )}
        </div>
      </div>
    </main>
  );
}
