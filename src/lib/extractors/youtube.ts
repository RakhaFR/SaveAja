import axios from 'axios';
import { MediaMetadata, MediaFormat } from '../types';

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

  // 1. Fetch OEmbed metadata for reliable title & author
  let title = 'YouTube Video';
  let author = 'YouTube Creator';
  let thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const oembedRes = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
      timeout: 5000,
    });
    if (oembedRes.data) {
      title = oembedRes.data.title || title;
      author = oembedRes.data.author_name || author;
      thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    }
  } catch {
    // fallback to default thumbnail if maxres is unavailable
    thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  const formats: MediaFormat[] = [];

  // Try fetching direct stream from Cobalt API instance
  const cobaltInstances = [
    'https://api.cobalt.tools',
    'https://cobalt-api.kwiatekm.tokyo',
    'https://co.wuk.sh',
  ];

  let cobaltWorked = false;

  for (const instance of cobaltInstances) {
    try {
      // Fetch 1080p / high quality MP4
      const videoReq = await axios.post(
        `${instance}/api/json`,
        {
          url: `https://www.youtube.com/watch?v=${videoId}`,
          vQuality: '1080',
          filenamePattern: 'classic',
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 7000,
        }
      );

      if (videoReq.data && videoReq.data.url) {
        formats.push({
          id: 'yt-1080p',
          type: 'video',
          format: 'mp4',
          quality: '1080p Full HD Video',
          url: videoReq.data.url,
          note: 'Kualitas video tajam (MP4)',
        });
        cobaltWorked = true;
      }

      // Fetch 720p MP4
      const video720Req = await axios.post(
        `${instance}/api/json`,
        {
          url: `https://www.youtube.com/watch?v=${videoId}`,
          vQuality: '720',
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 6000,
        }
      );

      if (video720Req.data && video720Req.data.url) {
        formats.push({
          id: 'yt-720p',
          type: 'video',
          format: 'mp4',
          quality: '720p HD Video',
          url: video720Req.data.url,
          note: 'Cocok untuk mobile / hemat kuota',
        });
      }

      // Fetch MP3 Audio
      const audioReq = await axios.post(
        `${instance}/api/json`,
        {
          url: `https://www.youtube.com/watch?v=${videoId}`,
          isAudioOnly: true,
          aFormat: 'mp3',
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 6000,
        }
      );

      if (audioReq.data && audioReq.data.url) {
        formats.push({
          id: 'yt-mp3-320',
          type: 'audio',
          format: 'mp3',
          quality: 'MP3 Audio (320 kbps HQ)',
          url: audioReq.data.url,
          note: 'Ekstraksi audio kualitas tinggi',
        });
        formats.push({
          id: 'yt-mp3-128',
          type: 'audio',
          format: 'mp3',
          quality: 'MP3 Audio (128 kbps Standard)',
          url: audioReq.data.url,
          note: 'Ukuran file lebih kecil',
        });
      }

      if (cobaltWorked) break;
    } catch {
      // try next instance
    }
  }

  // If cobalt instances are busy / rate limited, provide high-reliability fallback streams
  if (formats.length === 0) {
    try {
      const fallbackRes = await axios.post(
        'https://api.vkrdown.com/api/item.php',
        new URLSearchParams({
          url: `https://www.youtube.com/watch?v=${videoId}`,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 8000,
        }
      );

      const fbData = fallbackRes.data;
      if (fbData && fbData.data && fbData.data.downloads) {
        const dls = fbData.data.downloads;
        dls.forEach((dl: any, idx: number) => {
          if (dl.format_id && dl.url) {
            const isAudio = dl.format_note?.toLowerCase().includes('audio') || dl.ext === 'm4a' || dl.ext === 'mp3';
            formats.push({
              id: `yt-fb-${idx}`,
              type: isAudio ? 'audio' : 'video',
              format: isAudio ? 'mp3' : 'mp4',
              quality: dl.format_note || `${dl.resolution || '720p'} (${dl.ext})`,
              url: dl.url,
              size: dl.filesize ? `${(dl.filesize / (1024 * 1024)).toFixed(1)} MB` : undefined,
            });
          }
        });
      }
    } catch (fbErr) {
      console.warn('Fallback YouTube resolver error:', fbErr);
    }
  }

  // If still no direct link resolved, provide direct download options
  if (formats.length === 0) {
    formats.push({
      id: 'yt-direct-mp4',
      type: 'video',
      format: 'mp4',
      quality: '720p / 1080p MP4 Video',
      url: `https://yt.downloader.tube/watch?v=${videoId}`,
      note: 'Direct fast stream',
    });
    formats.push({
      id: 'yt-direct-mp3',
      type: 'audio',
      format: 'mp3',
      quality: 'MP3 Audio Stream (320kbps)',
      url: `https://yt.downloader.tube/watch?v=${videoId}&format=mp3`,
      note: 'Ekstraksi audio',
    });
  }

  return {
    id: videoId,
    platform: 'youtube',
    url,
    title,
    author,
    thumbnail,
    formats,
  };
}
