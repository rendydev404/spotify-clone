const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const API_BASE_URL = 'https://api.spotify.com/';

const getAccessToken = async () => {
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
    const errorBody = await response.json();
    console.error("Gagal mendapatkan Access Token:", JSON.stringify(errorBody, null, 2));
    throw new Error(`Gagal mendapatkan access token: ${response.statusText}`);
  }

  return response.json();
};

export const fetchSpotifyAPI = async (urlOrEndpoint: string) => {
  try {
    const { access_token } = await getAccessToken();
    
    const url = urlOrEndpoint.startsWith('https://') 
      ? urlOrEndpoint 
      : `${API_BASE_URL}${urlOrEndpoint}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error(`Gagal fetch data dari ${url}:`, JSON.stringify(errorDetails, null, 2));
      return null;
    }
    
    return response.json();

  } catch (error) {
    console.error("Terjadi error fatal di fetchSpotifyAPI:", error);
    return null;
  }
};
