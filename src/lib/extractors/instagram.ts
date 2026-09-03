import { MediaMetadata, MediaFormat } from '../types';
// @ts-ignore
import { igdl } from 'btch-downloader';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchInstagramCaption(url: string): Promise<{ title?: string; author?: string; authorUsername?: string }> {
  try {
    const shortcodeMatch = url.match(/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
    const shortcode = shortcodeMatch ? shortcodeMatch[1] : '';
    if (!shortcode) return {};

    const embedRes = await axios.get(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 6000,
    });

    const $ = cheerio.load(embedRes.data);
    const username = $('.CaptionUsername').text().trim() || $('.UsernameText').text().trim();
    const fullCaption = $('.Caption').text().trim();
    const cleanCaption = username && fullCaption.startsWith(username)
      ? fullCaption.substring(username.length).trim()
      : fullCaption;

    const firstLine = cleanCaption.split('\n')[0]?.trim();
    const title = firstLine && firstLine.length > 5 ? firstLine : undefined;

    return {
      title,
      author: username || 'Instagram Creator',
      authorUsername: username ? `@${username}` : undefined,
    };
  } catch {
    return {};
  }
}

export async function extractInstagram(url: string): Promise<MediaMetadata> {
  const cleanUrl = url.trim();
  const captionMeta = await fetchInstagramCaption(cleanUrl);

  // Method 1: btch-downloader (High reliability resolver for Reels, Posts, Stories)
  try {
    const data: any = await igdl(cleanUrl);
    if (data && data.result && Array.isArray(data.result) && data.result.length > 0) {
      const formats: MediaFormat[] = [];
      const primary: any = data.result[0];
      const videoUrl = primary.url || primary.video || primary.link;

      if (videoUrl) {
        formats.push({
          id: 'ig-video-hd',
          type: 'video',
          format: 'mp4',
          quality: '1080p / HD Video',
          url: videoUrl,
          note: 'Video Instagram Reels kualitas terbaik (MP4)',
        });
      }

      // Check for additional media items in carousel if available
      data.result.slice(1).forEach((item: any, idx: number) => {
        if (item.url) {
          formats.push({
            id: `ig-media-${idx + 2}`,
            type: 'video',
            format: 'mp4',
            quality: `Media #${idx + 2}`,
            url: item.url,
          });
        }
      });

      return {
        id: `ig_${Date.now()}`,
        platform: 'instagram',
        url: cleanUrl,
        title: captionMeta.title || 'Instagram Reel',
        author: captionMeta.author || 'Instagram Creator',
        authorUsername: captionMeta.authorUsername,
        thumbnail: primary.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
        formats,
      };
    }
  } catch (err: any) {
    console.warn('Instagram resolver 1 error:', err?.message || err);
  }

  // Method 2: Fallback direct embed resolver
  try {
    const shortcodeMatch = cleanUrl.match(/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
    const shortcode = shortcodeMatch ? shortcodeMatch[1] : '';

    if (shortcode) {
      const embedRes = await axios.get(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 8000,
      });

      const html = embedRes.data;
      const videoMatches = html.match(/https:\\\/\\\/[^"]+?\.mp4[^"]*/g) || html.match(/https:\/\/[^"]+?\.mp4[^"]*/g);

      if (videoMatches && videoMatches.length > 0) {
        const directVideoUrl = videoMatches[0].replace(/\\\//g, '/').replace(/\\u0026/g, '&');
        const formats: MediaFormat[] = [
          {
            id: 'ig-video-hd',
            type: 'video',
            format: 'mp4',
            quality: 'HD Video (MP4)',
            url: directVideoUrl,
            note: 'Original stream',
          }
        ];

        return {
          id: `ig_${shortcode}`,
          platform: 'instagram',
          url: cleanUrl,
          title: captionMeta.title || 'Instagram Reel',
          author: captionMeta.author || 'Instagram User',
          authorUsername: captionMeta.authorUsername,
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
          formats,
        };
      }
    }
  } catch (err2: any) {
    console.error('Instagram fallback error:', err2?.message);
  }

  throw new Error('Gagal mengambil data video Instagram. Pastikan akun tidak di-private dan link Reels/Post aktif.');
}
