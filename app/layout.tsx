import { ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@radix-ui/themes/styles.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Scrum Poker — Planning poker for agile teams',
  description:
    'Run fast, fair backlog estimates with private votes and a focused planning-poker experience.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Theme
          accentColor="crimson"
          grayColor="sand"
          radius="large"
          scaling="95%"
          className="flex min-h-0 flex-1 flex-col"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
