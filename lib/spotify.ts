// File: lib/spotify.ts

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

// PASTIKAN DUA BARIS INI MENGGUNAKAN URL SPOTIFY ASLI
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const API_BASE_URL = 'https://api.spotify.com/';

export async function getAccessToken() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Gagal mendapatkan access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function fetchSpotifyAPI(endpoint: string) {
  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error('Gagal fetch API Spotify');
  }

  return res.json();
}
