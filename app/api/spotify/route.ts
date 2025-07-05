import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type");

  if (!query || !type) {
    return NextResponse.json({ error: "Query or type missing" }, { status: 400 });
  }

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  // 🔑 Ambil Access Token
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // 🔑 Call API Spotify
  const apiRes = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!apiRes.ok) {
    return NextResponse.json({ error: "Spotify API error" }, { status: 500 });
  }

  const data = await apiRes.json();

  // ✅ WAJIB RETURN JSON
  return NextResponse.json(data);
}
