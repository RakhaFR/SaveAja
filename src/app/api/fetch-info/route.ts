import { NextRequest, NextResponse } from 'next/server';
import { extractMedia } from '@/lib/extractors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Silakan masukkan URL video yang valid.' },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return NextResponse.json(
        { success: false, error: 'URL harus diawali dengan http:// atau https://' },
        { status: 400 }
      );
    }

    const data = await extractMedia(trimmedUrl);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('API Fetch Info Error:', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Terjadi kesalahan saat memproses link. Pastikan link dapat diakses publik.',
      },
      { status: 400 }
    );
  }
}
