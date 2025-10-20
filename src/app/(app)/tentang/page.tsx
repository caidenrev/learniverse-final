
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Tentang Learniverse
        </h1>
        <p className="mt-2 text-muted-foreground">
          Misi kami adalah memberdayakan siswa dengan alat AI yang inovatif.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-lg">
          {aboutImage && (
            <Image
              src={aboutImage.imageUrl}
              alt="Tim Learniverse sedang berkolaborasi"
              fill
              className="object-cover"
              data-ai-hint="collaboration team"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Kekuatan AI untuk Pendidikan
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Learniverse lahir dari gagasan untuk membuat teknologi AI canggih dapat
            diakses oleh semua siswa. Kami percaya bahwa dengan alat yang
            tepat, setiap orang dapat mengatasi tantangan akademis,
            mempercepat proses belajar, dan mencapai potensi penuh mereka.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Misi kami adalah untuk memberdayakan siswa dengan menyediakan
            asisten belajar bertenaga AI yang intuitif, membantu, dan selalu
            tersedia 24/7. Baik Anda sedang mencari ide, menyusun penelitian,
            atau mencoba memahami konsep yang sulit, Learniverse hadir untuk
            mendukung perjalanan akademis Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
