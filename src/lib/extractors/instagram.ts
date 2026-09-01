import axios from 'axios';
import { MediaMetadata, MediaFormat } from '../types';

export async function extractInstagram(url: string): Promise<MediaMetadata> {
  const cleanUrl = url.split('?')[0];

  // Try extraction using resilient resolvers
  try {
    const response = await axios.post(
      'https://api.vkrdown.com/api/item.php',
      new URLSearchParams({
        url: cleanUrl,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 10000,
      }
    );

    const data = response.data;
    if (data && data.data && (data.data.video || data.data.downloads)) {
      const formats: MediaFormat[] = [];
      const item = data.data;

      const videoUrl = item.video || (item.downloads && item.downloads[0]?.url);
      if (videoUrl) {
        formats.push({
          id: 'ig-video-hd',
          type: 'video',
          format: 'mp4',
          quality: '1080p / 720p HD Video',
          url: videoUrl,
          note: 'Video Instagram Reels kualitas terbaik',
        });

        // Also provide audio option using the same video stream
        formats.push({
          id: 'ig-audio',
          type: 'audio',
          format: 'mp3',
          quality: 'Original Audio (MP3)',
          url: videoUrl,
          note: 'Suara asli Instagram Reel',
        });
      }

      return {
        id: `ig_${Date.now()}`,
        platform: 'instagram',
        url: cleanUrl,
        title: item.title || item.caption || 'Instagram Reel / Video',
        author: item.author || 'Instagram User',
        authorUsername: item.author ? `@${item.author}` : undefined,
        thumbnail: item.thumbnail || item.cover || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
        duration: item.duration || 'Reel',
        stats: {
          views: item.views || item.view_count || 0,
          likes: item.likes || item.like_count || 0,
        },
        formats,
      };
    }
  } catch (err) {
    console.warn('Instagram resolver 1 failed, trying fallback 2...', err);
  }

  // Fallback 2: Instagram Direct Snap Resolver
  try {
    const snapRes = await axios.get(`https://instavideosave.net/wp-json/aio-dl/video-data/`, {
      params: { url: cleanUrl },
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15',
        'Referer': 'https://instavideosave.net/',
      },
      timeout: 10000,
    });

    const snapData = snapRes.data;
    if (snapData && (snapData.url || snapData.medias)) {
      const formats: MediaFormat[] = [];
      const primaryMedia = snapData.medias?.[0] || snapData;
      const downloadUrl = primaryMedia.url || snapData.url;

      if (downloadUrl) {
        formats.push({
          id: 'ig-video-hd',
          type: 'video',
          format: 'mp4',
          quality: '1080p HD Video',
          url: downloadUrl,
          note: 'Instagram Reel High Quality',
        });

        formats.push({
          id: 'ig-audio',
          type: 'audio',
          format: 'mp3',
          quality: 'Original Audio (MP3)',
          url: downloadUrl,
          note: 'Suara asli Instagram Reel',
        });
      }

      return {
        id: `ig_${Date.now()}`,
        platform: 'instagram',
        url: cleanUrl,
        title: snapData.title || 'Instagram Reel',
        author: 'Instagram User',
        thumbnail: snapData.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
        formats,
      };
    }
  } catch (fallbackErr: any) {
    console.error('Instagram fallback error:', fallbackErr?.message);
  }

  throw new Error('Gagal mengambil data video Instagram. Pastikan akun tidak di-private dan link Reels/Post valid.');
}
