import Image from 'next/image';

export default function AppLogo({ width = 120 }: { width?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Scrum Poker logo"
      width={360}
      height={180}
      priority
      className="w-auto"
      style={{ width, height: 'auto' }}
    />
  );
}
