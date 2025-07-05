// components/YouTubePlayer.tsx
"use client";

import React from 'react';
import YouTube from 'react-youtube';

// Definisikan tipe untuk event agar tidak menggunakan 'any'
interface YouTubePlayerEvent {
  target: any; // Target dari event bisa sangat kompleks, jadi 'any' diterima di sini
  data: number;
}

// Definisikan tipe untuk props
interface YouTubePlayerProps {
  videoId: string | null;
  onReady: (event: YouTubePlayerEvent) => void;
  onStateChange: (event: YouTubePlayerEvent) => void;
  onError: (event: YouTubePlayerEvent) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onReady, onStateChange, onError }) => {
  if (!videoId) {
    return null;
  }

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
    },
  };

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      className="fixed -top-96 -left-96"
      onReady={onReady}
      onStateChange={onStateChange}
      onError={onError}
    />
  );
};

export default YouTubePlayer;