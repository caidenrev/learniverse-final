
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  BookCopy,
  BrainCircuit,
  GraduationCap,
  Languages,
  LayoutTemplate,
  Quote,
  Search,
  Bot,
  Map,
  FileText,
  FileQuestion,
  BookDown,
  CheckCircle2,
  Gem,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: 'Brainstorm Topik',
    description:
      'Dapatkan inspirasi dengan ide sub-topik yang relevan untuk mata kuliah apa pun.',
    href: '/brainstorm-topik',
  },
  {
    icon: <LayoutTemplate className="h-8 w-8" />,
    title: 'Kerangka Presentasi',
    description:
      'Secara instan menghasilkan draf presentasi slide-demi-slide yang logis.',
    href: '/kerangka-presentasi',
  },
  {
    icon: <BookCopy className="h-8 w-8" />,
    title: 'Pencari Analogi',
    description:
      'Jelaskan konsep teknis yang kompleks dengan analogi yang sederhana dan jelas.',
    href: '/pencari-analogi',
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: 'Kerangka Penelitian',
    description:
      'Susun tesis atau proposal penelitian Anda dengan kerangka akademis standar.',
    href: '/generator-kerangka-penelitian',
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: 'Pencari Referensi Cerdas',
    description:
      'Temukan kata kunci yang efektif untuk memaksimalkan riset akademis Anda.',
    href: '/pencari-referensi-cerdas',
  },
  {
    icon: <Quote className="h-8 w-8" />,
    title: 'Parafrase Akademik',
    description:
      'Ubah susunan kalimat untuk menghindari plagiarisme sambil mempertahankan makna aslinya.',
    href: '/parafrase-akademik',
  },
  {
    icon: <Languages className="h-8 w-8" />,
    title: 'Peringkas Jurnal',
    description:
      'Pahami jurnal bahasa Inggris yang kompleks dengan ringkasan yang mudah dibaca dalam bahasa Indonesia.',
    href: '/peringkas-jurnal',
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'Tutor AI',
    description:
      'Ajukan pertanyaan tentang materi kuliah Anda dan dapatkan jawaban instan.',
    href: '/tutor-ai',
  },
  {
    icon: <Map className="h-8 w-8" />,
    title: 'Roadmap Belajar',
    description:
      'Buat roadmap belajar yang terstruktur untuk topik apa pun yang ingin Anda kuasai.',
    href: '/generator-peta-belajar',
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'CV Reviewer',
    description:
      'Dapatkan masukan instan tentang CV Anda dari AI yang bertindak sebagai HR.',
    href: '/cv-reviewer',
  },
  {
    icon: <FileQuestion className="h-8 w-8" />,
    title: 'Pembuat Pertanyaan',
    description:
      'Buat daftar pertanyaan dari materi PDF atau PPTX untuk bahan kuis.',
    href: '/pembuat-pertanyaan',
  },
  {
    icon: <BookDown className="h-8 w-8" />,
    title: 'Peringkas Dokumen',
    description:
      'Unggah dokumen PDF atau Word untuk mendapatkan ringkasan dan kesimpulan instan.',
    href: '/rangkum-dokumen',
  },
];

export default function Home() {
  return (
    <div className="container">
      <main className="flex-1">
        <section className="grid grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <h2 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Tingkatkan Kemampuan Belajarmu dengan AI
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Mulai dari brainstorming topik hingga meringkas jurnal yang
              rumit, Learniverse adalah asisten akademis lengkap untukmu. Atasi
              kebuntuan menulis dan percepat proses belajarmu.
            </p>
            <div className="pt-4">
              <Link href="/brainstorm-topik">
                <Button size="lg" className="mt-4 px-10 py-6 text-lg">
                  Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-2xl md:h-96">
            <Image
              src="/hero-image.jpg"
              alt="Seorang siswa menggunakan laptop"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </section>

        <section className="-mx-4 bg-muted/50 px-4 py-16 sm:mx-0 sm:px-6 lg:py-24">
          <div className="mx-auto">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h3 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                Satu Set Alat <br></br> untuk Setiap Siswa
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Semua yang Anda butuhkan untuk unggul dalam perjalanan akademis
                Anda, didukung oleh AI generatif.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Link
                  href={feature.href}
                  key={feature.title}
                  className="flex"
                >
                  <Card className="flex flex-1 flex-col transition-all hover:ring-2 hover:ring-primary">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-3 text-primary">
                        {feature.icon}
                      </div>
                      <CardTitle className="font-headline text-xl">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="-mx-4 bg-muted/50 px-4 py-16 sm:mx-0 sm:px-6 lg:py-24">
          <div className="mx-auto">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h3 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                Paket Harga Sederhana
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Mulai gratis, upgrade saat Anda siap untuk membuka potensi
                penuh.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card className="flex flex-col p-6">
                <CardHeader className="p-0">
                  <CardTitle className="font-headline text-2xl">
                    Gratis
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 p-0 pt-4">
                  <p className="text-4xl font-bold">
                    Rp 0
                    <span className="text-base font-normal text-muted-foreground">
                      /bulan
                    </span>
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Akses terbatas ke fitur dasar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Cocok untuk penggunaan sesekali</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login">Mulai Gratis</Link>
                  </Button>
                </div>
              </Card>
              <Card className="relative flex flex-col border-2 border-primary p-6 shadow-lg">
                 <Badge
                  variant="destructive"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 animate-pulse"
                >
                  Diskon Terbatas!
                </Badge>
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <Gem className="h-6 w-6 text-primary" />
                    Premium
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 p-0 pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">Rp 10rb</span>
                    <span className="text-xl font-medium text-muted-foreground line-through">
                      Rp 50rb
                    </span>
                  </div>
                  <p className="text-sm font-normal text-muted-foreground -mt-2">
                    /bulan
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Akses tak terbatas ke semua fitur</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Model AI yang lebih canggih</span>
                    </li>
                     <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Dukungan prioritas</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="mt-6">
                  <Button className="w-full" asChild>
                    <Link href="/pricing">Lihat Detail Paket</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
