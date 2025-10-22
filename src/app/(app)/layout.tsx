
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { type ReactNode, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Jika selesai loading dan tidak ada user, arahkan ke halaman login.
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // Selama loading, tampilkan skeleton atau spinner untuk mencegah kedipan UI.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Jika sudah login, tampilkan layout aplikasi.
  if (user) {
    return (
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="sm:hidden">
              <Logo withText={true} />
            </div>
          </header>
          <main className="flex-1 p-4 pt-0 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fallback jika terjadi kondisi yang tidak terduga, meskipun seharusnya tidak pernah sampai sini.
  return null;
}
