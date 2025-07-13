// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { prompt: userPrompt } = await req.json();

    if (!userPrompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

    const result = await model.generateContent(masterPrompt);
    const response = await result.response;
    const query = response.text().trim();

    return NextResponse.json({ query });

  } catch (error) {
    console.error('Error with Google Generative AI:', error);
    return NextResponse.json({ error: 'Failed to generate playlist query' }, { status: 500 });
  }
} 