'use client';

import Image from 'next/image';

export default function QRBox() {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrUrl = `/api/qrcode?text=${encodeURIComponent(currentUrl)}`;

  return (
    <Image src={qrUrl} alt="QR code" width={200} height={200} unoptimized />
  );
}
