import axios from 'axios';
import { MediaMetadata, MediaFormat } from '../types';
// @ts-ignore
import { ttdl } from 'btch-downloader';

export async function extractTikTok(url: string): Promise<MediaMetadata> {
  const cleanUrl = url.trim();

  // Method 1: TikWM API (High speed, clean metadata & stats)
  try {
    const response = await axios.post(
      'https://www.tikwm.com/api/',
      new URLSearchParams({
        url: cleanUrl,
        hd: '1',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 10000,
      }
    );

    const result = response.data;
    if (result.code === 0 && result.data) {
      const data = result.data;
      const formats: MediaFormat[] = [];

      if (data.hdplay) {
        formats.push({
          id: 'tt-hd',
          type: 'video',
          format: 'mp4',
          quality: '1080p HD (No Watermark)',
          url: data.hdplay.startsWith('http') ? data.hdplay : `https://www.tikwm.com${data.hdplay}`,
          note: 'Kualitas tertinggi tanpa watermark',
        });
      }

      if (data.play) {
        formats.push({
          id: 'tt-sd',
          type: 'video',
          format: 'mp4',
          quality: '720p SD (No Watermark)',
          url: data.play.startsWith('http') ? data.play : `https://www.tikwm.com${data.play}`,
          note: 'Ukuran lebih hemat kuota',
        });
      }

      if (data.music) {
        formats.push({
          id: 'tt-audio',
          type: 'audio',
          format: 'mp3',
          quality: 'MP3 Audio (Original Sound)',
          url: data.music.startsWith('http') ? data.music : `https://www.tikwm.com${data.music}`,
          note: data.music_info?.title ? `Sound: ${data.music_info.title}` : 'Ekstraksi audio/soundtrack',
        });
      }

      const durationSeconds = data.duration || 0;
      const durationFormatted = `${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, '0')}`;

      return {
        id: data.id || `tt_${Date.now()}`,
        platform: 'tiktok',
        url: cleanUrl,
        title: data.title || 'TikTok Video',
        author: data.author?.nickname || 'TikTok Creator',
        authorUsername: data.author?.unique_id ? `@${data.author.unique_id}` : undefined,
        authorAvatar: data.author?.avatar?.startsWith('http') ? data.author.avatar : `https://www.tikwm.com${data.author?.avatar || ''}`,
        thumbnail: data.cover?.startsWith('http') ? data.cover : `https://www.tikwm.com${data.cover || ''}`,
        duration: durationFormatted,
        stats: {
          views: data.play_count || 0,
          likes: data.digg_count || 0,
        },
        formats,
      };
    }
  } catch (err) {
    console.warn('TikWM failed, trying fallback 2...', err);
  }

  // Method 2: btch-downloader ttdl fallback
  try {
    const fallbackData: any = await ttdl(cleanUrl);
    if (fallbackData) {
      const formats: MediaFormat[] = [];
      if (fallbackData.video || fallbackData.nowatermark || fallbackData.video_nowatermark) {
        formats.push({
          id: 'tt-hd',
          type: 'video',
          format: 'mp4',
          quality: 'HD Video (No Watermark)',
          url: fallbackData.video || fallbackData.nowatermark || fallbackData.video_nowatermark,
          note: 'Tanpa watermark',
        });
      }

      if (fallbackData.audio || fallbackData.music) {
        formats.push({
          id: 'tt-audio',
          type: 'audio',
          format: 'mp3',
          quality: 'MP3 Audio',
          url: fallbackData.audio || fallbackData.music,
        });
      }

      return {
        id: `tt_${Date.now()}`,
        platform: 'tiktok',
        url: cleanUrl,
        title: fallbackData.title || 'TikTok Video',
        author: fallbackData.author?.nickname || 'TikTok User',
        thumbnail: fallbackData.thumbnail || fallbackData.cover || 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&auto=format&fit=crop&q=80',
        formats,
      };
    }
  } catch (err2: any) {
    console.error('TikTok fallback error:', err2?.message);
  }

  throw new Error('Gagal memproses link TikTok. Pastikan link video publik dan valid.');
}
