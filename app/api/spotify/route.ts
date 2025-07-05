// app/api/spotify/route.ts
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Endpoint resmi dari Spotify
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search`;

// Fungsi untuk mendapatkan Access Token
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

// Fungsi utama route handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type");

  if (!query || !type) {
    return NextResponse.json(
      { error: "Parameter 'q' dan 'type' dibutuhkan" },
      { status: 400 }
    );
  }

  try {
    const token = await getAccessToken();

    // Membuat URL dengan benar menggunakan URLSearchParams
    const searchUrl = new URL(SEARCH_ENDPOINT);
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('type', type);
    searchUrl.searchParams.append('limit', '20'); // Ambil 20 hasil

    const apiRes = await fetch(searchUrl.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("Error dari Spotify API:", errorText);
      return NextResponse.json(
        { error: "Gagal mengambil data dari Spotify API" },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}