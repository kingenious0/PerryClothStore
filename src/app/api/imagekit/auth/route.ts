import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export const dynamic = 'force-dynamic';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function GET() {
  try {
    const result = imagekit.getAuthenticationParameters();
    return NextResponse.json(result);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json({ error: 'Failed to generate auth parameters' }, { status: 500 });
  }
}
