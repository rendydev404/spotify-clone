// app/api/spotify/route.ts
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const API_BASE_URL = `https://api.spotify.com/v1`;

// Fungsi untuk mendapatkan Access Token (tidak berubah)
async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Spotify credentials are not set in .env.local');
  }
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gagal mendapatkan access token Spotify:", errorText);
    throw new Error('Gagal mendapatkan access token');
  }
  const data = await response.json();
  return data.access_token;
}

// Fungsi utama route handler (sudah di-upgrade)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // Tipe request: 'search' atau 'recommendations'
  
  if (!type) {
    return NextResponse.json({ error: "Parameter 'type' dibutuhkan" }, { status: 400 });
  }

  try {
    const token = await getAccessToken();
    let apiRes;

    // KONDISI BARU: Jika tipe adalah 'recommendations'
    if (type === 'recommendations') {
      const seed_artists = searchParams.get('seed_artists');
      const limit = searchParams.get('limit') || '10';

      if (!seed_artists) {
        return NextResponse.json({ error: "Parameter 'seed_artists' dibutuhkan untuk rekomendasi" }, { status: 400 });
      }

      const recommendationUrl = new URL(`${API_BASE_URL}/recommendations`);
      recommendationUrl.searchParams.append('seed_artists', seed_artists);
      recommendationUrl.searchParams.append('limit', limit);
      
      apiRes = await fetch(recommendationUrl.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

    // KONDISI LAMA: Jika tipe adalah 'search' (atau lainnya)
    } else {
      const query = searchParams.get("q");
      if (!query) {
        return NextResponse.json({ error: "Parameter 'q' dibutuhkan untuk pencarian" }, { status: 400 });
      }

      const searchUrl = new URL(`${API_BASE_URL}/search`);
      searchUrl.searchParams.append('q', query);
      searchUrl.searchParams.append('type', 'track'); // Kita hanya cari track
      searchUrl.searchParams.append('limit', '20');
      
      apiRes = await fetch(searchUrl.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("Error dari Spotify API:", errorText);
      return NextResponse.json({ error: "Gagal mengambil data dari Spotify API" }, { status: apiRes.status });
    }

    const data = await apiRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}