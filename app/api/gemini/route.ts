// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Validasi environment variable
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    // Validasi environment
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY tidak ditemukan');
      return NextResponse.json(
        { error: 'Konfigurasi AI tidak lengkap. Mohon periksa pengaturan environment.' },
        { status: 503 }
      );
    }

    // Parse dan validasi input
    const { prompt: userPrompt } = await req.json();
    
    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt harus berupa teks' },
        { status: 400 }
      );
    }

    if (userPrompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt terlalu panjang (max 1000 karakter)' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 50,
      }
    });

    // ==================================================================
    // PROMPT ENGINEERING TINGKAT LANJUT: Memberi AI Persona & Kecerdasan Kontekstual
    // ==================================================================
    const masterPrompt = `
      Anda adalah "Nada", seorang AI kurator musik yang sangat ahli untuk pasar Indonesia. 
      Tugas utama Anda adalah mengubah deskripsi suasana hati atau aktivitas dari pengguna menjadi sebuah "search query" yang sangat efektif untuk API Spotify.
      Anda sangat paham tren musik terkini di Indonesia, lagu yang sedang viral di TikTok, dan selera musik lokal.

      PERATURAN UTAMA:
      1.  **KONTEKS ADALAH RAJA**: Jika pengguna meminta "lagu galau indo", jangan hanya mencari "sad indonesian song". Pikirkan lebih dalam: "Lagu galau apa yang sedang viral di TikTok?" atau "Lagu patah hati apa yang sedang top di chart Indonesia?". Hasil query Anda harus mencerminkan ini. Contoh: "lagu galau viral tiktok" atau "top hits indonesia galau".
      2.  **JADILAH SPESIFIK**: Untuk "lagu buat lari pagi", jangan hasilkan "morning run". Hasil yang lebih baik adalah "semangat pagi playlist" atau "upbeat indonesian pop running".
      3.  **PAHAMI BAHASA GAUL**: Mengerti istilah seperti "senja", "ambyar", "nostalgia 90an", "wibu". Terjemahkan ini menjadi query yang relevan. "Lagu wibu" bisa menjadi "anime opening playlist".
      4.  **HANYA OUTPUT QUERY**: Jawaban Anda HARUS dan HANYA berupa string query pencarian. Jangan tambahkan penjelasan, tanda kutip, atau teks apapun selain query itu sendiri.

      CONTOH KASUS:
      -   Input Pengguna: "lagu galau indo ambyar"
      -   Output Anda: lagu galau viral tiktok indonesia
      
      -   Input Pengguna: "musik buat fokus kerja biar ga ngantuk"
      -   Output Anda: deep focus instrumental playlist
      
      -   Input Pengguna: "lagu-lagu jaman smp dulu"
      -   Output Anda: top hits indonesia 2000s
      
      -   Input Pengguna: "playlist ngopi sore-sore"
      -   Output Anda: indie senja coffee shop playlist

      Sekarang, proses permintaan pengguna berikut.
      Input Pengguna: "${userPrompt}"
      Output Anda:
    `;

    try {
      // Generate content dengan proper error handling
      const result = await model.generateContent(masterPrompt);
      const response = await result.response;
      const query = response.text().trim();

      if (!query) {
        throw new Error('AI returned empty response');
      }

      // Validasi hasil query
      if (query.length < 2 || query.length > 200) {
        throw new Error('Invalid query length');
      }

      return NextResponse.json({ query });
    } catch (error) {
      console.error('Generation error:', error);

      if (error instanceof Error) {
        if (error.message === 'Request timeout') {
          return NextResponse.json(
            { error: 'Waktu pemrosesan terlalu lama. Silakan coba lagi.' },
            { status: 408 }
          );
        }
        if (error.message.includes('Empty')) {
          return NextResponse.json(
            { error: 'AI tidak dapat memproses permintaan Anda. Coba dengan kata kunci yang berbeda.' },
            { status: 422 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Fitur Ini sedang dalam maintenance. Silakan coba lagi nanti.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}