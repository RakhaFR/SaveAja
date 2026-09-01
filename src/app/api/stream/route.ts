import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Detect which User-Agent to use based on the download URL host
function pickUserAgent(url: string): string {
  const hostname = new URL(url).hostname;
  // ymcdn.org and rapidcdn.app are used by btch-downloader / snapsave
  // They require TelegramBot UA because the signed token encodes this UA
  if (hostname.includes('ymcdn.org') || hostname.includes('rapidcdn.app') || hostname.includes('d.rapidcdn.app')) {
    return 'TelegramBot (like TwitterBot)';
  }
  return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'SaveAja_Media';
  const format = searchParams.get('format') || 'mp4';

  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  const cleanFilename = filename.replace(/[^a-zA-Z0-9_\s-]/g, '_').substring(0, 60);
  const fullFilename = `${cleanFilename}.${format}`;
  const contentType = format === 'mp3' ? 'audio/mpeg' : 'video/mp4';
  const userAgent = pickUserAgent(targetUrl);

  try {
    const response = await axios({
      method: 'GET',
      url: targetUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': userAgent,
        'Accept': '*/*',
      },
      timeout: 30000,
      maxRedirects: 5,
    });

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${fullFilename}"`);
    headers.set('Content-Type', contentType);

    if (response.headers['content-length']) {
      headers.set('Content-Length', String(response.headers['content-length']));
    }

    const nodeStream = response.data;
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer) => {
          controller.enqueue(chunk);
        });
        nodeStream.on('end', () => {
          controller.close();
        });
        nodeStream.on('error', (err: Error) => {
          controller.error(err);
        });
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new NextResponse(webStream, { status: 200, headers });
  } catch (error: any) {
    console.error('Proxy stream failed, trying direct redirect:', error?.message);
    // Last resort: redirect the browser directly to the source URL
    // with the correct User-Agent embedded in the Location redirect
    return NextResponse.redirect(targetUrl);
  }
}
