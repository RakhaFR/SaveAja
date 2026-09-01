import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { extractMedia, detectPlatform } from '@/lib/extractors';

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
  const mediaUrl = searchParams.get('mediaUrl');
  const formatId = searchParams.get('formatId');
  const format = searchParams.get('format') || 'mp4';
  const filename = searchParams.get('filename') || 'SaveAja_Media';

  if (!mediaUrl || !formatId) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  try {
    // Re-fetch a FRESH signed URL at download time so it's bound to this server's IP
    const platform = detectPlatform(mediaUrl);
    if (platform === 'unknown') {
      return new NextResponse('Platform tidak dikenali', { status: 400 });
    }

    const freshData = await extractMedia(mediaUrl);
    const targetFormat = freshData.formats.find(f => f.id === formatId)
      || freshData.formats.find(f => f.format === format);

    if (!targetFormat) {
      return new NextResponse('Format tidak tersedia', { status: 404 });
    }

    const downloadUrl = targetFormat.url;
    const contentType = format === 'mp3' ? 'audio/mpeg' : 'video/mp4';
    const cleanFilename = filename.replace(/[^a-zA-Z0-9_\s-]/g, '_').substring(0, 60);
    const fullFilename = `${cleanFilename}.${format}`;
    const userAgent = pickUserAgent(downloadUrl);

    // Pipe directly from CDN through server to browser in one continuous connection
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
    responseHeaders.set('Content-Disposition', `attachment; filename="${fullFilename}"`);
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
