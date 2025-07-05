// lib/spotify.ts - KODE DEBUGGING MAKSIMAL

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const API_BASE_URL = 'https://api.spotify.com/';

const getAccessToken = async () => {
  console.log("--- [1] Mencoba mengambil Access Token ---");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("--- [GAGAL di Langkah 1] Gagal mendapatkan Access Token ---");
    const errorBody = await response.json();
    console.error("Detail Kegagalan:", JSON.stringify(errorBody, null, 2));
    throw new Error(`Gagal di getAccessToken`);
  }

  const tokenData = await response.json();
  console.log("--- [2] Berhasil Mendapat Token ---");
  return tokenData;
};

export const fetchSpotifyAPI = async (urlOrEndpoint: string) => {
  try {
    const { access_token } = await getAccessToken();

    const url = urlOrEndpoint.startsWith('https://') 
      ? urlOrEndpoint 
      : `${API_BASE_URL}${urlOrEndpoint}`;

    console.log("--- [3] Mencoba Fetch Data ke URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      console.error("--- [GAGAL di Langkah 3] Gagal Fetch Data (setelah dapat token) ---");
      const errorDetails = await response.json();
      console.error("Detail Error dari Spotify:", JSON.stringify(errorDetails, null, 2));
      return null;
    }

    console.log("--- [4] BERHASIL! ---");
    return response.json();

  } catch (error) {
    console.error("--- [ERROR FATAL] Terjadi error yang tidak terduga ---");
    // Error di sini biasanya karena getAccessToken gagal
    return null;
  }
};