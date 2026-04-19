import QRCode from 'qrcode';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') ?? 'No URL provided';

  const svg = await QRCode.toString(text, { type: 'svg' });

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
