
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
    title: 'Peta Jalan Belajar',
    description:
      'Buat peta jalan belajar yang terstruktur untuk topik apa pun yang ingin Anda kuasai.',
    href: '/generator-peta-belajar',
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'CV Reviewer',
    description: 'Dapatkan masukan instan tentang CV Anda dari AI yang bertindak sebagai HR.',
    href: '/cv-reviewer',
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'hero-image');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 bg-background/80 py-4 backdrop-blur-sm shadow-md">
        <div className="container flex items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/tentang"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Tentang
            </Link>
            <Link
              href="/kontak"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Kontak
            </Link>
          </nav>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px]">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  <Link
                    href="/tentang"
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Info className="mr-2 inline-block h-5 w-5" />
                    Tentang
                  </Link>
                  <Link
                    href="/kontak"
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Mail className="mr-2 inline-block h-5 w-5" />
                    Kontak
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
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
          </section>

          <section className="bg-muted/50 -mx-4 px-4 py-16 sm:mx-0 sm:px-6 lg:py-24">
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
                <h3 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                  Tentang Learniverse
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Learniverse lahir dari gagasan untuk membuat teknologi AI canggih
                  dapat diakses oleh semua siswa. Kami percaya bahwa dengan alat
                  yang tepat, setiap orang dapat mengatasi tantangan akademis,
                  mempercepat proses belajar, dan mencapai potensi penuh mereka.
                  Misi kami adalah untuk memberdayakan siswa dengan menyediakan
                  asisten belajar bertenaga AI yang intuitif, membantu, dan
                  selalu tersedia 24/7.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Learniverse. Seluruh hak cipta.
          </p>
        </footer>
      </div>
    </div>
  );
}
