import Link from 'next/link';
import TrackCard from "@/components/TrackCard";
import { fetchSpotifyAPI } from "@/lib/spotify";
import { Track } from "@/types";

// Fungsi untuk mencari lagu-lagu populer
async function getPopularTracks() {
  try {
    // Kita cari berdasarkan query 'popular', ini akan memberikan berbagai lagu populer
    const data = await fetchSpotifyAPI(`v1/search?q=popular&type=track&limit=10`);
    if (!data || !data.tracks) return [];
    return data.tracks.items;
  } catch (error) {
    console.error("Gagal mengambil lagu populer:", error);
    return [];
  }
}

export default async function HomePage() {
  const tracks: Track[] = await getPopularTracks();

  return (
    <main className="bg-zinc-900 text-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        Jelajahi Musik
      </h1>
      <p className="text-zinc-400 text-base mb-8">
        Lagu populer berdasarkan pencarian.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tracks.map((track) => (
          // Setiap kartu sekarang menjadi sebuah link
          <Link href={`/track/${track.id}`} key={track.id}>
            <TrackCard track={track} />
          </Link>
        ))}
      </div>
    </main>
  );
}