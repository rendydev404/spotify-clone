// components/AIPlaylistGenerator.tsx
"use client";

import { useState, useEffect } from "react";
import { WandSparkles, X, LoaderCircle } from "lucide-react";
import { Track } from "@/types";
import { usePlayer } from "@/app/context/PlayerContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Impor framer-motion

export default function AIPlaylistGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { playSong, activeTrack } = usePlayer();
  const router = useRouter();

  const handleGeneratePlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const geminiResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!geminiResponse.ok) throw new Error("Gagal mendapatkan respons dari AI.");

      const geminiData = await geminiResponse.json();
      const searchQuery = geminiData.query.trim().replace(/"/g, "");

      const spotifyResponse = await fetch(`/api/spotify?type=search&q=${encodeURIComponent(searchQuery)}`);
      if (!spotifyResponse.ok) throw new Error("Gagal mencari lagu di Spotify.");
      
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
      const errorMessage = (err instanceof Error) ? err.message : "Terjadi kesalahan tidak diketahui.";
      setError(`Gagal membuat playlist: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Mengambang (Floating Action Button) */}
       <div className={`fixed right-4 md:right-8 z-[45] transition-all duration-300 ease-in-out
        ${activeTrack 
          ? 'bottom-[10rem] md:bottom-24' // 1rem di atas player
          : 'bottom-20 md:bottom-8'
        }`
      }>
        <motion.button 
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-white rounded-full p-4 shadow-lg"
          aria-label="Buat Playlist AI"
        >
          <WandSparkles size={28} />
        </motion.button>
      </div>

      {/* AnimatePresence menangani animasi saat komponen muncul/hilang */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)} // Menutup modal saat klik di luar
          >
            {/* Konten Modal dengan Animasi Muncul */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat klik di dalam
              className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 w-full max-w-md relative text-white shadow-2xl"
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <WandSparkles className="text-primary" size={24}/>
                </div>
                <h2 className="text-xl font-bold">AI Playlist Generator</h2>
              </div>
              <p className="text-sm text-zinc-400 mb-5">
                Jelaskan suasana, genre, atau artis. Biarkan AI cerdas kami yang meracik playlist sempurna untukmu.
              </p>
              <form onSubmit={handleGeneratePlaylist}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Contoh: lagu pop indo galau yang lagi viral..."
                  className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg py-3 px-4 border-2 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  rows={3}
                />
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                <motion.button
                  type="submit"
                  disabled={isLoading || !prompt}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-white font-bold rounded-lg py-3 px-4 mt-4 transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isLoading ? <LoaderCircle className="animate-spin" /> : "Buat Playlist"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}