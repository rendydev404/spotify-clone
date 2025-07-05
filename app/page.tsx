import Link from 'next/link';
import TrackCard from "@/components/TrackCard";
import { fetchSpotifyAPI } from "@/lib/spotify";
import { Track } from "@/types";

// FUNGSI PROFESIONAL: Menggunakan 'search' yang lebih stabil dengan fallback
async function getDiscoverTracks() {
  try {
    // Mencari lagu baru yang sedang tren. Ini query yang lebih stabil.
    const data = await fetchSpotifyAPI(`v1/search?q=tag:new&type=track&limit=20`);

    // Jika query pertama tidak menghasilkan apa-apa, coba query cadangan
    if (!data || !data.tracks || data.tracks.items.length === 0) {
      console.log("Query 'tag:new' tidak menghasilkan lagu, mencoba query fallback 'genre:pop'...");
      const fallbackData = await fetchSpotifyAPI(`v1/search?q=genre:pop&type=track&limit=20`);
      if (!fallbackData || !fallbackData.tracks || !fallbackData.tracks.items) return [];
      
      // Filter hasil dari fallback
      return fallbackData.tracks.items.filter((track: Track) => track.album && track.album.images.length > 0);
    }

    // Filter hasil dari query utama
    return data.tracks.items.filter((track: Track) => track.album && track.album.images.length > 0);

  } catch (error) {
    console.error("Gagal mengambil lagu untuk halaman utama:", error);
    return [];
  }
}

export default async function HomePage() {
  const tracks: Track[] = await getDiscoverTracks();

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        Jelajahi Musik
      </h1>
      <p className="text-zinc-400 text-base mb-8">
        Lagu populer untukmu.
      </p>

      {tracks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <Link href={`/track/${track.id}`} key={track.id}>
              <TrackCard track={track} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-zinc-400">Gagal Memuat Lagu</h2>
            <p className="text-zinc-500 mt-2">
              Ini kemungkinan besar karena batasan 'Development Mode' dari akun developer Spotify Anda.
              <br />
              Coba ajukan "Quota Extension" di dashboard developer Spotify untuk akses penuh.
            </p>
        </div>
      )}
    </main>
  );
}
