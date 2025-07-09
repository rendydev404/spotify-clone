// components/AIPlaylistGenerator.tsx
"use client";

import { useState, useEffect } from "react";
import { WandSparkles, X, LoaderCircle } from "lucide-react";
import { Track } from "@/types";
import { usePlayer } from "@/app/context/PlayerContext";
import { useRouter } from "next/navigation";

export default function AIPlaylistGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendering, setIsRendering] = useState(false); // State baru untuk animasi
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { playSong, activeTrack } = usePlayer();
  const router = useRouter();

  // Efek untuk animasi keluar
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setIsRendering(true);
    } else {
      timer = setTimeout(() => setIsRendering(false), 300); // Durasi harus sama dengan transisi
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleGeneratePlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const fullPrompt = `You are a Spotify playlist expert. Based on the user's request: "${prompt}", generate a concise and effective search query for the Spotify API. The query should be a short string of keywords combining genres, moods, and key terms. Respond ONLY with the generated search query string. Examples: - User request: "lagu pop indonesia yang semangat buat lari pagi" -> Response: "upbeat indonesian pop for running" - User request: "playlist akustik syahdu untuk teman ngopi" -> Response: "cozy indonesian acoustic"`;

      const geminiResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!geminiResponse.ok) throw new Error("Gagal mendapatkan respons dari AI.");

      const geminiData = await geminiResponse.json();
      const searchQuery = geminiData.result.trim().replace(/"/g, "");

      const spotifyResponse = await fetch(`/api/spotify?type=search&q=${encodeURIComponent(searchQuery)}`);
      const spotifyData = await spotifyResponse.json();
      const tracks: Track[] = spotifyData?.tracks?.items || [];

      if (tracks.length > 0) {
        const newPlaylistName = `AI Playlist: ${prompt}`;
        localStorage.setItem('my-playlist-name', newPlaylistName);
        localStorage.setItem('my-playlist', JSON.stringify(tracks));
        
        playSong(tracks[0], tracks, 0);
        router.push('/playlist');
        setIsOpen(false);
      } else {
        setError("Tidak ada lagu yang ditemukan untuk deskripsi itu.");
      }

    } catch (err) {
      setError("Gagal membuat playlist. Coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <>
      {/* Tombol Mengambang (Floating Action Button) */}
      <div className={`fixed right-4 md:right-8 z-40 transition-all duration-300 ease-in-out
        ${activeTrack 
          ? 'bottom-[calc(5rem+4.5rem)] md:bottom-[calc(5rem+2rem)]' // Naik saat player ada
          : 'bottom-20 md:bottom-8' // Posisi default
        }`
      }>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:scale-110 active:scale-100 transition-transform duration-200"
          aria-label="Buat Playlist AI"
        >
          <WandSparkles size={28} />
        </button>
      </div>

      {/* Modal/Pop-up dengan Animasi */}
      {isRendering && (
        <div className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`bg-surface rounded-lg p-6 w-full max-w-md relative text-text-primary transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-text-secondary hover:text-text-primary">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <WandSparkles className="text-primary" />
              AI Playlist Generator
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              Jelaskan suasana, genre, atau aktivitas, dan biarkan AI membuatkan playlist untukmu.
            </p>
            <form onSubmit={handleGeneratePlaylist}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: lagu untuk perjalanan malam, pop syahdu..."
                className="w-full bg-background text-text-primary placeholder-text-secondary rounded-md py-2 px-3 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white font-bold rounded-md py-2 px-4 mt-4 transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Buat Playlist"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}