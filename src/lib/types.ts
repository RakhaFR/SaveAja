export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'unknown';

export interface MediaFormat {
  id: string;
  type: 'video' | 'audio';
  format: 'mp4' | 'mp3' | 'm4a';
  quality: string;
  url: string;
  size?: string;
  note?: string;
}

export interface MediaMetadata {
  id: string;
  platform: Platform;
  url: string;
  title: string;
  author: string;
  authorUsername?: string;
  authorAvatar?: string;
  thumbnail: string;
  duration?: string;
  stats?: {
    views?: string | number;
    likes?: string | number;
    comments?: string | number;
    shares?: string | number;
  };
  formats: MediaFormat[];
}

export interface ApiResponse<T = MediaMetadata> {
  success: boolean;
  data?: T;
  error?: string;
}
