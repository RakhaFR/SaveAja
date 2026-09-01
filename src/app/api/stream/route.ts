import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'SaveAja_Media';
  const format = searchParams.get('format') || 'mp4';

  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const cleanFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
    const fullFilename = `${cleanFilename}.${format}`;

    const response = await axios({
      method: 'GET',
      url: targetUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': targetUrl,
      },
      timeout: 30000,
    });

    const contentType = format === 'mp3' ? 'audio/mpeg' : 'video/mp4';

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${fullFilename}"`);
    headers.set('Content-Type', contentType);

    if (response.headers['content-length']) {
      headers.set('Content-Length', String(response.headers['content-length']));
    }

    // Convert node stream to web ReadableStream
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

    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Streaming download error, redirecting directly to source URL:', error?.message);
    // If proxy stream encounters cross-origin or size block, redirect directly to original URL
    return NextResponse.redirect(targetUrl);
  }
}
