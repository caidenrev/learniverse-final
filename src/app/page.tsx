
'use client';

import { useState } from 'react';
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
  Menu,
  X,
  Info,
  Mail,
  FileText,
  FileQuestion,
  Github,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from '@/components/logo';

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
];

export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 py-4 shadow-sm backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-50/40 via-purple-50/40 to-pink-50/40"></div>

        <div className="container relative mx-auto flex items-center justify-between px-4 sm:px-6">
          <div className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
            <Logo />
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/tentang"
              className="group relative rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:text-blue-600"
            >
              <span className="relative z-10">Tentang</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-3/4"></span>
            </Link>
            <Link
              href="/kontak"
              className="group relative rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:text-blue-600"
            >
              <span className="relative z-10">Kontak</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-3/4"></span>
            </Link>
          </nav>

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative transform rounded-xl border border-transparent transition-all duration-300 hover:scale-110 hover:border-blue-200/50 hover:bg-blue-50/50 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-100/50"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
                  <Menu className="relative z-10 h-6 w-6" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] border-l border-gray-100 bg-white sm:w-[320px]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>

                <SheetHeader className="relative">
                  <SheetTitle className="text-left">
                    <Logo />
                  </SheetTitle>
                </SheetHeader>

                <nav className="relative mt-8 flex flex-col gap-2">
                  <Link
                    href="/tentang"
                    className="group flex items-center rounded-xl border border-transparent p-3.5 text-base font-medium text-gray-700 transition-all duration-300 hover:border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50/50 hover:text-blue-600 hover:shadow-md hover:shadow-blue-100/50"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <div className="mr-3 rounded-lg bg-blue-50 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100 group-hover:shadow-sm">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      Tentang
                    </span>
                  </Link>
                  <Link
                    href="/kontak"
                    className="group flex items-center rounded-xl border border-transparent p-3.5 text-base font-medium text-gray-700 transition-all duration-300 hover:border-purple-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50/50 hover:text-purple-600 hover:shadow-md hover:shadow-purple-100/50"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <div className="mr-3 rounded-lg bg-purple-50 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-100 group-hover:shadow-sm">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      Kontak
                    </span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

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
                  Satu Set Alat untuk Setiap Siswa
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

          <section className="px-4 py-16 lg:py-24">
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
                <h3 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                  Tentang Learniverse
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Learniverse lahir dari gagasan untuk membuat teknologi AI
                  canggih dapat diakses oleh semua siswa. Kami percaya bahwa
                  dengan alat yang tepat, setiap orang dapat mengatasi
                  tantangan akademis, mempercepat proses belajar, dan mencapai
                  potensi penuh mereka. Misi kami adalah untuk memberdayakan
                  siswa dengan menyediakan asisten belajar bertenaga AI yang
                  intuitif, membantu, dan selalu tersedia 24/7.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t bg-background">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <Logo />
              <p className="mt-4 text-center text-sm text-muted-foreground md:text-left">
                Asisten belajar cerdas bertenaga AI.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 md:items-end">
              <h4 className="font-headline text-lg font-semibold">Navigasi</h4>
              <div className="flex gap-4">
                <Link
                  href="/tentang"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Tentang
                </Link>
                <Link
                  href="/kontak"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Kontak
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm text-muted-foreground">
                Dibuat dengan ❤️ oleh{' '}
                <a
                  href="https://github.com/caidenrev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Revan
                </a>
              </p>
              <div className="mt-2 flex items-center gap-3">
                <a
                  href="https://github.com/caidenrev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t py-4">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Revan. Seluruh hak cipta.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
