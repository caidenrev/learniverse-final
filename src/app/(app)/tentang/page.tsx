
'use client';

import Image from 'next/image';
import { Github, Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-16">
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
          <Image
            src="/hero-image.jpg"
            alt="Tim Learniverse sedang berkolaborasi"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
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

      <div className="space-y-12">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold">
            Di Balik Layar: Sang Kreator
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Setiap proyek hebat memiliki cerita. Kenali sosok di balik Learniverse.
          </p>
        </div>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
          <div className="col-span-1 grid grid-cols-2 gap-4 lg:col-span-2">
            <div className="relative h-48 w-full overflow-hidden rounded-2xl shadow-lg sm:h-64">
              <Image
                src="/foto-revan-1.jpg"
                alt="Foto Revan 1"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 20vw, 20vw"
              />
            </div>
            <div className="relative h-48 w-full overflow-hidden rounded-2xl shadow-lg sm:h-64">
              <Image
                src="/foto-revan-2.jpg"
                alt="Foto Revan 2"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 20vw, 20vw"
              />
            </div>
            <div className="relative col-span-2 h-48 w-full overflow-hidden rounded-2xl shadow-lg sm:h-64">
              <Image
                src="/foto-revan-3.jpg"
                alt="Foto Revan 3"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center space-y-6 lg:col-span-3">
            <div className="space-y-3">
              <h3 className="font-headline text-2xl font-semibold">
                Revan (Eka Revandi)
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                Revan adalah seorang Cloud Architect dan Software Engineer yang
                berada di balik lahirnya Learniverse. Platform ini berawal dari
                kebutuhannya sendiri—rasa lelah karena harus terus-menerus
                beralih antara berbagai tab, dari Gemini hingga platform AI
                berbayar lainnya, hanya untuk menyelesaikan tugas akademis.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Awalnya dibangun untuk penggunaan pribadi, proyek ini
                secara tak terduga mendapat antusiasme besar dari teman-teman
                mahasiswanya. Melihat potensi Learniverse untuk membantu lebih
                banyak orang, Revan memutuskan untuk mengembangkannya menjadi
                platform yang dapat diakses oleh semua, dengan misi untuk
                menyederhanakan proses belajar dan riset.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/caidenrev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Globe className="h-6 w-6" />
                <span className="sr-only">Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
