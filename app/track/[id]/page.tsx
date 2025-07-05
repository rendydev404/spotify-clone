import { fetchSpotifyAPI } from "@/lib/spotify";
import { Track } from "@/types";
import TrackDetailsClient from "@/components/TrackDetailsClient"; // Kita impor komponen client

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

// Ini adalah Halaman Server.
export default async function TrackDetailPage({ params }: { params: { id: string } }) {
  const track = await getTrackDetails(params.id);

  // Tambahkan console.log di sini untuk melihat data asli dari Spotify
  console.log("Data Detail Lagu Diterima:", JSON.stringify(track, null, 2));

  // Jika lagu tidak ditemukan, tampilkan pesan error
  if (!track) {
    return (
      <main className="bg-zinc-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Lagu Tidak Ditemukan</h1>
        </div>
      </main>
    );
  }

  // Jika data berhasil didapat, kita lempar ke Komponen Client untuk ditampilkan
  return <TrackDetailsClient track={track} />;
}
