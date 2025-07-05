// app/playlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Track } from "@/types";
import { usePlayer } from "@/app/context/PlayerContext";
import { Pencil } from "lucide-react";
import PlaylistTrackItem from "@/components/PlaylistTrackItem"; // Impor komponen baru

export default function PlaylistPage() {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState("Playlist Saya");
  const [isEditing, setIsEditing] = useState(false);
  const { playSong } = usePlayer();

  // Muat data dari localStorage saat komponen pertama kali dirender
  useEffect(() => {
    const savedPlaylist: Track[] = JSON.parse(localStorage.getItem('my-playlist') || '[]');
    const savedName = localStorage.getItem('my-playlist-name') || "Playlist Saya";
    setPlaylist(savedPlaylist);
    setPlaylistName(savedName);
  }, []);

  // Fungsi untuk mengubah nama playlist
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistName(e.target.value);
  };

  // Fungsi untuk menyimpan nama playlist baru
  const saveName = () => {
    localStorage.setItem('my-playlist-name', playlistName);
    setIsEditing(false);
  };

  // Fungsi untuk menghapus lagu dari playlist
  const handleRemoveFromPlaylist = (trackIdToRemove: string) => {
    const newPlaylist = playlist.filter(track => track.id !== trackIdToRemove);
    setPlaylist(newPlaylist); // Update state lokal agar UI langsung berubah
    localStorage.setItem('my-playlist', JSON.stringify(newPlaylist)); // Simpan ke localStorage
  };
  
  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        {isEditing ? (
          <input 
            type="text" 
            value={playlistName}
            onChange={handleNameChange}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            className="text-3xl font-bold text-white bg-transparent border-b-2 border-primary focus:outline-none"
            autoFocus
          />
        ) : (
          <h1 className="text-3xl font-bold text-white">{playlistName}</h1>
        )}
        <button onClick={() => setIsEditing(!isEditing)} className="text-zinc-400 hover:text-white"><Pencil size={20} /></button>
      </div>

      {playlist.length > 0 ? (
        // Gunakan komponen baru di sini
        <div className="space-y-2">
          {playlist.map((track, index) => (
            <PlaylistTrackItem
              key={`${track.id}-${index}`}
              track={track}
              onPlay={() => playSong(track, playlist, index)}
              onRemove={() => handleRemoveFromPlaylist(track.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-400 text-center py-10">
          Playlist Anda masih kosong. Tambahkan lagu favoritmu!
        </p>
      )}
    </main>
  );
}