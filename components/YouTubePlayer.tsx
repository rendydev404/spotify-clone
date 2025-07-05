// components/YouTubePlayer.tsx
"use client";

import React from 'react';
import YouTube from 'react-youtube';

// Definisikan tipe untuk props, termasuk fungsi untuk event handling
interface YouTubePlayerProps {
  videoId: string | null;
  onReady: (event: any) => void;
  onStateChange: (event: any) => void;
  onError: (event: any) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onReady, onStateChange, onError }) => {
  // Jangan render komponen jika tidak ada videoId yang aktif
  if (!videoId) {
    return null;
  }

  // Opsi untuk YouTube Player
  const opts = {
    // Ukuran player kita sembunyikan karena hanya butuh audionya
    height: '0',
    width: '0',
    playerVars: {
      // 'autoplay: 1' berarti video akan otomatis diputar saat siap
      autoplay: 1,
      // Sembunyikan kontrol player YouTube
      controls: 0,
    },
  };

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      // Kita gunakan class `fixed` dan posisi negatif untuk menyembunyikan player
      // dari pandangan dan dari layout halaman.
      className="fixed -top-96 -left-96"
      onReady={onReady}
      onStateChange={onStateChange}
      onError={onError}
    />
  );
};

export default YouTubePlayer;