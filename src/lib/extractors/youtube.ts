import axios from 'axios';
import { MediaMetadata, MediaFormat } from '../types';
// @ts-ignore
import { youtube } from 'btch-downloader';

export function extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export async function extractYouTube(url: string): Promise<MediaMetadata> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error('Link YouTube tidak valid. Format yang didukung: video biasa, shorts, atau youtu.be');
  }

  // Method 1: btch-downloader youtube function (most reliable, no blocked IPs)
  try {
    const data: any = await youtube(url);
    if (data && data.status && (data.mp4 || data.mp3)) {
      const formats: MediaFormat[] = [];

      if (data.mp4) {
        formats.push({
          id: 'yt-video',
          type: 'video',
          format: 'mp4',
          quality: 'HD MP4 Video',
          url: data.mp4,
          note: 'Video YouTube kualitas tinggi',
        });
      }

      if (data.mp3) {
        formats.push({
          id: 'yt-audio',
          type: 'audio',
          format: 'm4a',
          quality: 'M4A / AAC Audio',
          url: data.mp3,
          note: 'Audio kualitas tinggi asli YouTube',
        });
      }

      return {
        id: videoId,
        platform: 'youtube',
        url,
        title: data.title || 'YouTube Video',
        author: data.author || 'YouTube Creator',
        thumbnail: data.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        formats,
      };
    }
  } catch (err: any) {
    console.warn('btch-downloader youtube failed:', err?.message);
  }

  // Method 2: Cobalt API instances fallback
  const cobaltInstances = [
    'https://api.cobalt.tools',
    'https://cobalt-api.kwiatekm.tokyo',
    'https://co.wuk.sh',
  ];

  // Fetch metadata via oembed (always works)
  let title = 'YouTube Video';
  let author = 'YouTube Creator';
  let thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const oembedRes = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { timeout: 5000 }
    );
    if (oembedRes.data) {
      title = oembedRes.data.title || title;
      author = oembedRes.data.author_name || author;
      thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    }
  } catch {
    // fallback defaults already set
  }

  const formats: MediaFormat[] = [];

  for (const instance of cobaltInstances) {
    try {
      const [videoRes, audioRes] = await Promise.allSettled([
        axios.post(`${instance}/api/json`, {
          url: `https://www.youtube.com/watch?v=${videoId}`,
          vQuality: '720',
          filenamePattern: 'classic',
        }, {
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          timeout: 6000,
        }),
        axios.post(`${instance}/api/json`, {
          url: `https://www.youtube.com/watch?v=${videoId}`,
          isAudioOnly: true,
          aFormat: 'mp3',
        }, {
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          timeout: 6000,
        }),
      ]);

      if (videoRes.status === 'fulfilled' && videoRes.value.data?.url) {
        formats.push({
          id: 'yt-video',
          type: 'video',
          format: 'mp4',
          quality: '720p HD Video',
          url: videoRes.value.data.url,
        });
      }

      if (audioRes.status === 'fulfilled' && audioRes.value.data?.url) {
        formats.push({
          id: 'yt-audio',
          type: 'audio',
          format: 'mp3',
          quality: 'MP3 Audio',
          url: audioRes.value.data.url,
          note: 'Ekstraksi audio dari video',
        });
      }

      if (formats.length > 0) break;
    } catch {
      // try next instance
    }
  }

  if (formats.length === 0) {
    throw new Error('Gagal mengambil link download YouTube. Coba beberapa saat lagi.');
  }

  return { id: videoId, platform: 'youtube', url, title, author, thumbnail, formats };
}
