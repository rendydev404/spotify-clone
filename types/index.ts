export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
   id: string;
  name: string;
}

export interface Album {
  name: string;
  images: SpotifyImage[];
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  preview_url: string | null;
}