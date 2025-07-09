// app/api/gemini/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Ambil kunci API dari environment variables
const apiKey = process.env.GEMINI_API_KEY;

// Pastikan kunci API ada sebelum menginisialisasi
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Pilih model AI yang akan kita gunakan. 'gemini-1.5-flash' adalah yang terbaru dan tercepat.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export async function POST(req: Request) {
  try {
    // Ambil prompt dari permintaan yang dikirim oleh aplikasi kita
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt dibutuhkan" }, { status: 400 });
    }

    // Kirim prompt ke Gemini dan dapatkan hasilnya
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Kirim kembali jawaban dari Gemini ke aplikasi kita
    return NextResponse.json({ result: text });

  } catch (error) {
    console.error("Error saat memanggil Gemini API:", error);
    return NextResponse.json({ error: "Gagal memanggil Gemini API" }, { status: 500 });
  }
}