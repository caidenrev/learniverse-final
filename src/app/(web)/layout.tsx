
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
import { Gem, Info, Mail, Menu } from 'lucide-react';
import { Chatbot } from '@/components/chatbot';

export default function WebLayout({ children }: { children: ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Background Ambience and Grid Pattern */}
<div
  className="pointer-events-none absolute inset-0 -z-10 h-full bg-background"
  aria-hidden="true"
>
  {/* Mobile Ambience (dibuat tidak terlalu tajam) */}
  {/* Diubah dari from-primary/40 menjadi from-primary/20 */}
  <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent md:hidden"></div>
  
  {/* Glow di kiri atas desktop (diperbesar) */}
  {/* Diubah dari h-64 w-64 menjadi h-96 w-96 */}
  <div className="absolute -left-16 top-40 hidden h-96 w-96 rounded-full bg-primary/20 blur-3xl md:block"></div>
  
  {/* Glow di kanan atas desktop (diperbesar) */}
  {/* Diubah dari h-64 w-64 menjadi h-96 w-96 */}
  <div className="absolute -right-16 top-40 hidden h-96 w-96 rounded-full bg-primary/20 blur-3xl md:block"></div>

  {/* Fading Grid Lines */}
  <div
    className="absolute inset-0 bg-[image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_100%)]"
  ></div>
</div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <Logo withText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
  <Link
    href="/pricing"
    className="relative text-base md:text-lg font-medium text-muted-foreground transition-all duration-300 hover:text-primary hover:-translate-y-[2px] hover:drop-shadow-[0_0_8px_rgba(109,40,217,0.4)] group"
  >
    Harga
    <span className="absolute left-1/2 bottom-[-6px] h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" />
  </Link>

  <Link
    href="/tentang"
    className="relative text-base md:text-lg font-medium text-muted-foreground transition-all duration-300 hover:text-primary hover:-translate-y-[2px] hover:drop-shadow-[0_0_8px_rgba(109,40,217,0.4)] group"
  >
    Tentang
    <span className="absolute left-1/2 bottom-[-6px] h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" />
  </Link>

  <Link
    href="/kontak"
    className="relative text-base md:text-lg font-medium text-muted-foreground transition-all duration-300 hover:text-primary hover:-translate-y-[2px] hover:drop-shadow-[0_0_8px_rgba(109,40,217,0.4)] group"
  >
    Kontak
    <span className="absolute left-1/2 bottom-[-6px] h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" />
  </Link>
</nav>


          <div className="flex items-center gap-4">
            <UserAuth />
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" onClick={() => setIsSheetOpen(false)}>
                      <Logo withText={true} />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-2">
                  <Link
                    href="/pricing"
                    className="flex items-center gap-3 rounded-md p-2 text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Gem className="h-5 w-5" />
                    Harga
                  </Link>
                  <Link
                    href="/tentang"
                    className="flex items-center gap-3 rounded-md p-2 text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Info className="h-5 w-5" />
                    Tentang
                  </Link>
                  <Link
                    href="/kontak"
                    className="flex items-center gap-3 rounded-md p-2 text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Mail className="h-5 w-5" />
                    Kontak
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <Chatbot />

      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/">
              <Logo withText={true} />
            </Link>
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              Asisten belajar cerdas bertenaga AI untuk mendukung perjalanan
              akademis Anda.
            </p>
          </div>
          <div className="flex items-center gap-4">
           
          </div>
        </div>
        <div className="border-t py-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Learniverse. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
