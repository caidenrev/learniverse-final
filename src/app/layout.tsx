import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

const APP_NAME = 'Learniverse';
const APP_DESCRIPTION = 'Asisten belajar cerdas bertenaga AI untuk mendukung perjalanan akademis Anda, mulai dari brainstorming ide, riset, hingga belajar untuk ujian.';
const APP_URL = 'https://learniverse-ai-ashen.web.app'; // Ganti dengan URL produksi Anda

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: ['AI', 'mahasiswa', 'belajar', 'akademis', 'riset', 'skripsi', 'kecerdasan buatan', 'pendidikan', 'Revan', 'Eka Revandi'],
  authors: [{ name: 'Revan (Eka Revandi)', url: 'https://www.revansite.web.id/' }],
  creator: 'Revan (Eka Revandi)',
  icons: {
    icon: '/logo-learniverse.svg',
  },
  manifest: '/manifest.json', // Jika Anda punya file manifest
  openGraph: {
    type: 'website',
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/hero-image.png`,
        width: 1200,
        height: 630,
        alt: `Banner ${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@revan_caiden', // Ganti dengan handle Twitter Anda jika ada
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/hero-image.png`],
  },
  metadataBase: new URL(APP_URL),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>{children}</FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
