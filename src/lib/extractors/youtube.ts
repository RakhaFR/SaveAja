import axios from 'axios';
import { MediaMetadata, MediaFormat } from '../types';
// @ts-ignore
import { youtube } from 'btch-downloader';

export function extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Dynamically resolves a direct downloadable file URL for YouTube using high-reliability scrapers.
 */
export async function fetchYouTubeDownloadUrl(videoUrl: string, format: 'mp4' | 'mp3' | '720' | '1080' = 'mp4'): Promise<string> {
  const targetFmt = format === 'mp3' ? 'mp3' : '720';
  
  // Method 1: Loader.to API engine
  try {
    const initRes = await axios.get('https://loader.to/ajax/download.php', {
      params: { url: videoUrl, format: targetFmt },
      timeout: 10000,
    });
    
    if (initRes.data?.id) {
      const taskId = initRes.data.id;
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 1200));
        const progRes = await axios.get('https://loader.to/ajax/progress.php', {
          params: { id: taskId },
          timeout: 8000,
        });
        
        if (progRes.data?.success === 1 && progRes.data?.download_url) {
          return progRes.data.download_url;
        }
        
        if (progRes.data?.text && progRes.data.text.toLowerCase().includes('error')) {
          break;
        }
      }
    }
  } catch (err: any) {
    console.warn('Loader.to conversion failed:', err?.message);
  }

  // Method 2: btch-downloader
  try {
    const data: any = await youtube(videoUrl);
    if (data && data.status) {
      if (format === 'mp3' && data.mp3) return data.mp3;
      if (data.mp4) return data.mp4;
    }
  } catch (err: any) {
    console.warn('btch-downloader fallback failed:', err?.message);
  }

  // Method 3: Cobalt fallback instances
  const cobaltInstances = [
    'https://cobalt-api.kwiatekm.tokyo',
    'https://cobalt.api.timelessoses.top',
    'https://co.wuk.sh',
  ];

  for (const inst of cobaltInstances) {
    try {
      const res = await axios.post(`${inst}/api/json`, {
        url: videoUrl,
        vQuality: '720',
        isAudioOnly: format === 'mp3',
        aFormat: 'mp3',
      }, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        timeout: 6000,
      });

      if (res.data?.url) {
        return res.data.url;
      }
    } catch {
      // try next
    }
  }

  throw new Error('Gagal menyiapkan link download YouTube. Silakan coba beberapa saat lagi.');
}

/**
 * Extracts YouTube video metadata and formats.
 */
export async function extractYouTube(url: string): Promise<MediaMetadata> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error('Link YouTube tidak valid. Format yang didukung: video biasa, Shorts, atau youtu.be');
  }

  const standardUrl = `https://www.youtube.com/watch?v=${videoId}`;
  let title = 'YouTube Video';
  let author = 'YouTube Creator';
  let thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  // Fetch verified metadata via official YouTube oEmbed API
  try {
    const oembedRes = await axios.get(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(standardUrl)}&format=json`,
      { timeout: 5000 }
    );
    if (oembedRes.data) {
      title = oembedRes.data.title || title;
      author = oembedRes.data.author_name || author;
      thumbnail = oembedRes.data.thumbnail_url || thumbnail;
    }
  } catch (err: any) {
    if (err?.response && (err.response.status === 404 || err.response.status === 400 || err.response.status === 401 || err.response.status === 403)) {
      throw new Error('Video YouTube tidak ditemukan, bersifat privat, atau telah dihapus oleh pemiliknya.');
    }
    console.warn('YouTube oembed warning:', err?.message);
  }

  // Pre-configured formats for YouTube (fulfilled on-demand or fast resolved)
  const formats: MediaFormat[] = [
    {
      id: 'yt-video-720',
      type: 'video',
      format: 'mp4',
      quality: 'HD 720p Video (MP4)',
      url: `/api/download-file?mediaUrl=${encodeURIComponent(standardUrl)}&formatId=yt-video-720&format=mp4&filename=${encodeURIComponent(title)}`,
      note: 'Video kualitas jernih High Definition',
    },
    {
      id: 'yt-audio-mp3',
      type: 'audio',
      format: 'mp3',
      quality: 'High Quality MP3 Audio',
      url: `/api/download-file?mediaUrl=${encodeURIComponent(standardUrl)}&formatId=yt-audio-mp3&format=mp3&filename=${encodeURIComponent(title)}`,
      note: 'Audio musik kualitas jernih (320kbps)',
    },
  ];

  return {
    id: videoId,
    platform: 'youtube',
    url: standardUrl,
    title,
    author,
    thumbnail,
    formats,
  };
}
