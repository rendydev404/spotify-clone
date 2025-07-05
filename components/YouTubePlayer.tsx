// components/YouTubePlayer.tsx
"use client";

import React from 'react';
import YouTube from 'react-youtube';

// Kita bisa kembalikan ke 'any' karena aturannya sudah dimatikan
interface YouTubePlayerProps {
  videoId: string | null;
  onReady: (event: any) => void;
  onStateChange: (event: any) => void;
  onError: (event: any) => void;
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