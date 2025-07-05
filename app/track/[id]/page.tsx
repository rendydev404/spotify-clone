// app/track/[id]/page.tsx
import { fetchSpotifyAPI } from "@/lib/spotify";
import { Track } from "@/types";
import TrackDetailsClient from "@/components/TrackDetailsClient";

// Definisikan tipe untuk props halaman ini
type Props = {
  params: {
    id: string;
  };
};

// Fungsi untuk mengambil detail satu lagu berdasarkan ID-nya
async function getTrackDetails(id: string): Promise<Track | null> {
  try {
    const track = await fetchSpotifyAPI(`v1/tracks/${id}`);
    return track;
  } catch (error) {
    console.error(`Gagal mengambil detail lagu untuk ID: ${id}`, error);
    return null;
  }
}

// Gunakan tipe 'Props' yang sudah kita definisikan
export default async function TrackDetailPage({ params }: Props) {
  const track = await getTrackDetails(params.id);

  if (!track) {
    return (
      <main className="bg-zinc-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Lagu Tidak Ditemukan</h1>
        </div>
      </main>
    );
  }

  return <TrackDetailsClient track={track} />;
}