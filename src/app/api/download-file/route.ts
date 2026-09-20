import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { extractMedia, detectPlatform } from '@/lib/extractors';
import { fetchYouTubeDownloadUrl } from '@/lib/extractors/youtube';

function pickUserAgent(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes('ymcdn.org') || hostname.includes('rapidcdn.app')) {
      return 'TelegramBot (like TwitterBot)';
    }
  } catch { /* ignore */ }
  return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const targetUrl = searchParams.get('targetUrl');
  const mediaUrl = searchParams.get('mediaUrl');
  const formatId = searchParams.get('formatId');
  const format = searchParams.get('format') || 'mp4';
  const filename = searchParams.get('filename') || 'SaveAja_Media';

  let downloadUrl = targetUrl;

  try {
    // If targetUrl is not a direct http(s) URL or is a proxy path, resolve dynamically
    if (!downloadUrl || downloadUrl.startsWith('/api/')) {
      const urlToProcess = mediaUrl || (targetUrl && targetUrl.includes('mediaUrl=') ? new URL(targetUrl, 'http://localhost').searchParams.get('mediaUrl') : null);
      
      if (!urlToProcess) {
        return new NextResponse('Missing video URL parameters', { status: 400 });
      }

      const platform = detectPlatform(urlToProcess);
      if (platform === 'youtube') {
        downloadUrl = await fetchYouTubeDownloadUrl(urlToProcess, format as any);
      } else {
        const freshData = await extractMedia(urlToProcess);
        const targetFormat = freshData.formats.find(f => f.id === formatId)
          || freshData.formats.find(f => f.format === format)
          || freshData.formats[0];

        if (!targetFormat || !targetFormat.url) {
          return new NextResponse('Format tidak tersedia', { status: 404 });
        }

        downloadUrl = targetFormat.url;
      }
    }

    let contentType = 'video/mp4';
    if (format === 'mp3') {
      contentType = 'audio/mpeg';
    } else if (format === 'm4a') {
      contentType = 'audio/mp4';
    }
    const cleanFilename = filename.replace(/[^a-zA-Z0-9_\s-]/g, '_').substring(0, 60);
    const fullFilename = `${cleanFilename}.${format}`;
    const userAgent = pickUserAgent(downloadUrl);

    // Pipe directly from CDN through server to browser
    const response = await axios({
      method: 'GET',
      url: downloadUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': userAgent,
        'Accept': '*/*',
      },
      timeout: 120000,
      maxRedirects: 10,
    });

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Disposition', `attachment; filename="${encodeURIComponent(fullFilename)}"`);
    responseHeaders.set('Content-Type', contentType);
    if (response.headers['content-length']) {
      responseHeaders.set('Content-Length', String(response.headers['content-length']));
    }

    const nodeStream = response.data;
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err: Error) => controller.error(err));
      },
      cancel() { nodeStream.destroy(); },
    });

    return new NextResponse(webStream, { status: 200, headers: responseHeaders });
  } catch (error: any) {
    console.error('Download-file endpoint error:', error?.message);
    return new NextResponse(
      `Download failed: ${error?.message || 'Unknown error'}`,
      { status: 500 }
    );
  }
}
