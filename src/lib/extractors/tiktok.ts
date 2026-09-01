import axios from 'axios';
import { MediaMetadata, MediaFormat } from '../types';

export async function extractTikTok(url: string): Promise<MediaMetadata> {
  try {
    const response = await axios.post(
      'https://www.tikwm.com/api/',
      new URLSearchParams({
        url: url.trim(),
        hd: '1',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 10000,
      }
    );

    const result = response.data;
    if (result.code !== 0 || !result.data) {
      throw new Error(result.msg || 'Gagal mengambil data video TikTok');
    }

    const data = result.data;
    const formats: MediaFormat[] = [];

    // HD Video without watermark
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

    // Standard Video without watermark
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

    // Original Watermarked Video (if available)
    if (data.wmplay) {
      formats.push({
        id: 'tt-wm',
        type: 'video',
        format: 'mp4',
        quality: 'Original (With Watermark)',
        url: data.wmplay.startsWith('http') ? data.wmplay : `https://www.tikwm.com${data.wmplay}`,
        note: 'Video asli dengan watermark',
      });
    }

    // MP3 Audio
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
      url,
      title: data.title || 'TikTok Video',
      author: data.author?.nickname || 'TikTok Creator',
      authorUsername: data.author?.unique_id ? `@${data.author.unique_id}` : undefined,
      authorAvatar: data.author?.avatar?.startsWith('http') ? data.author.avatar : `https://www.tikwm.com${data.author?.avatar || ''}`,
      thumbnail: data.cover?.startsWith('http') ? data.cover : `https://www.tikwm.com${data.cover || ''}`,
      duration: durationFormatted,
      stats: {
        views: data.play_count || 0,
        likes: data.digg_count || 0,
        comments: data.comment_count || 0,
        shares: data.share_count || 0,
      },
      formats,
    };
  } catch (error: any) {
    console.error('TikTok extraction error:', error?.message || error);
    throw new Error(error.response?.data?.msg || error.message || 'Gagal memproses link TikTok. Pastikan link publik dan valid.');
  }
}
