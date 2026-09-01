import { MediaMetadata, Platform } from '../types';
import { extractTikTok } from './tiktok';
import { extractInstagram } from './instagram';
import { extractYouTube } from './youtube';

export function detectPlatform(url: string): Platform {
  const normalized = url.toLowerCase().trim();
  if (normalized.includes('tiktok.com') || normalized.includes('douyin.com')) {
    return 'tiktok';
  }
  if (normalized.includes('instagram.com') || normalized.includes('instagr.am')) {
    return 'instagram';
  }
  if (
    normalized.includes('youtube.com') ||
    normalized.includes('youtu.be') ||
    normalized.includes('youtube.com/shorts')
  ) {
    return 'youtube';
  }
  return 'unknown';
}

export async function extractMedia(url: string): Promise<MediaMetadata> {
  const platform = detectPlatform(url);

  switch (platform) {
    case 'tiktok':
      return await extractTikTok(url);
    case 'instagram':
      return await extractInstagram(url);
    case 'youtube':
      return await extractYouTube(url);
    default:
      throw new Error(
        'Platform tidak didukung. Harap masukkan link valid dari YouTube, TikTok, atau Instagram Reels.'
      );
  }
}
