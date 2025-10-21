'use client';

import Image from 'next/image';
import { Github, Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-12 px-4 sm:space-y-16 sm:px-6 lg:px-8">
      <div className="pt-4 sm:pt-6">
        <h1 className="font-headline text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
          Tentang Learniverse
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Misi kami adalah memberdayakan siswa dengan alat AI yang inovatif.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-lg sm:h-80 md:h-96">
          <Image
            src="/hero-image.jpg"
            alt="Tim Learniverse sedang berkolaborasi"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h2 className="font-headline text-xl font-semibold sm:text-2xl md:text-3xl">
            Kekuatan AI untuk Pendidikan
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Learniverse lahir dari gagasan untuk membuat teknologi AI canggih dapat
            diakses oleh semua siswa. Kami percaya bahwa dengan alat yang
            tepat, setiap orang dapat mengatasi tantangan akademis,
            mempercepat proses belajar, dan mencapai potensi penuh mereka.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Misi kami adalah untuk memberdayakan siswa dengan menyediakan
            asisten belajar bertenaga AI yang intuitif, membantu, dan selalu
            tersedia 24/7. Baik Anda sedang mencari ide, menyusun penelitian,
            atau mencoba memahami konsep yang sulit, Learniverse hadir untuk
            mendukung perjalanan akademis Anda.
          </p>
        </div>
      </div>

      <div className="space-y-8 sm:space-y-12">
        <div className="text-center">
          <h2 className="font-headline text-2xl font-bold sm:text-3xl md:text-4xl">
            Di Balik Layar: Sang Kreator
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Setiap proyek hebat memiliki cerita. Kenali sosok di balik Learniverse.
          </p>
        </div>
        
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Image Gallery */}
          <div className="col-span-1 grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-2">
            <div className="relative h-40 w-full overflow-hidden rounded-xl shadow-lg sm:h-48 sm:rounded-2xl md:h-56 lg:h-64">
              <Image
                src="/foto-revan1.jpg"
                alt="Foto Revan 1"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
              />
            </div>
            <div className="relative h-40 w-full overflow-hidden rounded-xl shadow-lg sm:h-48 sm:rounded-2xl md:h-56 lg:h-64">
              <Image
                src="/foto-revan2.jpg"
                alt="Foto Revan 2"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
              />
            </div>
            <div className="relative col-span-2 h-40 w-full overflow-hidden rounded-xl shadow-lg sm:h-48 sm:rounded-2xl md:h-56 lg:h-64">
              <Image
                src="/foto-revan3.jpg"
                alt="Foto Revan 3"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 95vw, 40vw"
              />
            </div>
          </div>

          {/* Content */}
          <div className="col-span-1 flex flex-col justify-center space-y-4 sm:space-y-6 lg:col-span-3">
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-headline text-xl font-semibold sm:text-2xl md:text-3xl">
                Revan (Eka Revandi)
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Revan adalah seorang Cloud Architect dan Software Engineer yang
                berada di balik lahirnya Learniverse. Platform ini berawal dari
                kebutuhannya sendiri—rasa lelah karena harus terus-menerus
                beralih antara berbagai tab, dari Gemini hingga platform AI
                berbayar lainnya, hanya untuk menyelesaikan tugas akademis.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Awalnya dibangun untuk penggunaan pribadi, proyek ini
                secara tak terduga mendapat antusiasme besar dari teman-teman
                mahasiswanya. Melihat potensi Learniverse untuk membantu lebih
                banyak orang, Revan memutuskan untuk mengembangkannya menjadi
                platform yang dapat diakses oleh semua, dengan misi untuk
                menyederhanakan proses belajar dan riset.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="https://github.com/caidenrev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Website"
              >
                <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}