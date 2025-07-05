// components/YouTubePlayer.tsx
"use client";

import React from 'react';
import YouTube from 'react-youtube';
import { YouTubeEvent } from '@/app/context/PlayerContext'; // Impor tipe dari PlayerContext

interface YouTubePlayerProps {
  videoId: string | null;
  onReady: (event: YouTubeEvent) => void;
  onStateChange: (event: YouTubeEvent) => void;
  onError: (event: YouTubeEvent) => void;
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
      // @ts-ignore Tipe dari react-youtube mungkin tidak sepenuhnya cocok, kita bisa abaikan sementara
      onReady={onReady}
      // @ts-ignore
      onStateChange={onStateChange}
      // @ts-ignore
      onError={onError}
    />
  );
};

export default YouTubePlayer;