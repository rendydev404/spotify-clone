// lib/youtube.ts

// Fungsi utama untuk mencari lagu di YouTube
export async function searchYouTubeForSong(
  songTitle: string,
  artistName: string
): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error("Kunci API YouTube tidak ditemukan. Pastikan ada di .env.local");
    return null;
  }

  // 💡 Filter Cerdas: Daftar prioritas query pencarian untuk hasil terbaik
  const searchQueries = [
    `${songTitle} ${artistName} official audio`,
    `${songTitle} ${artistName} audio`,
    `${songTitle} ${artistName} official lyric video`,
    `${songTitle} ${artistName}`,
  ];

  console.log(`Mencari lagu: ${songTitle} - ${artistName}`);

  for (const query of searchQueries) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query
        )}&type=video&maxResults=1&key=${apiKey}`
      );

      if (!response.ok) {
        console.error(`Error dari YouTube API untuk query "${query}":`, await response.text());
        continue; // Coba query berikutnya jika yang ini gagal
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        console.log(`✅ Video ditemukan untuk query "${query}": ID ${videoId}`);
        return videoId; // Kembalikan ID video pertama yang ditemukan
      }
    } catch (error) {
      console.error(`Gagal melakukan fetch ke YouTube untuk query "${query}":`, error);
      // Jangan langsung berhenti, mungkin masalah sementara. Lanjutkan ke query berikutnya.
    }
  }

  console.warn(`❌ Tidak ada video yang ditemukan untuk "${songTitle}" setelah mencoba semua query.`);
  return null; // Kembalikan null jika semua query gagal
}