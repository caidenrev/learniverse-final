
'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { UserAuth } from '@/components/user-auth';
import { Gem, Info, Mail, Menu, Github } from 'lucide-react';

export default function WebLayout({ children }: { children: ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 py-4 shadow-sm backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-50/40 via-purple-50/40 to-pink-50/40"></div>
        <div className="container relative mx-auto flex items-center justify-between px-4 sm:px-6">
          <div className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/pricing"
              className="group relative rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:text-blue-600"
            >
              <span className="relative z-10">Harga</span>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-3/4"></span>
            </Link>
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
            <div className="ml-4">
              <UserAuth />
            </div>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <UserAuth />
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
                    <Link href="/" onClick={() => setIsSheetOpen(false)}>
                      <Logo />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="relative mt-8 flex flex-col gap-2">
                  <Link
                    href="/pricing"
                    className="group flex items-center rounded-xl border border-transparent p-3.5 text-base font-medium text-gray-700 transition-all duration-300 hover:border-green-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50/50 hover:text-green-600 hover:shadow-md hover:shadow-green-100/50"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <div className="mr-3 rounded-lg bg-green-50 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-100 group-hover:shadow-sm">
                      <Gem className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      Harga
                    </span>
                  </Link>
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

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-background">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 text-center md:grid-cols-3 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Asisten belajar cerdas bertenaga AI.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 md:items-start">
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
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Harga
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-headline text-lg font-semibold">Hubungi</h4>
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
            © {new Date().getFullYear()} Learniverse. Seluruh hak cipta.
          </p>
        </div>
      </footer>
    </div>
  );
}
