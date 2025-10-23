
'use client';

import { useState } from 'react';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  useDoc,
} from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Archive, AlertCircle, Sparkles } from 'lucide-react';
import { PremiumLockPopup } from '@/components/premium-lock-popup';

export default function ProjectHistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const subscriptionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'subscriptions', 'default');
  }, [firestore, user]);

  const { data: subscription, isLoading: isSubscriptionLoading } =
    useDoc(subscriptionRef);

  const projectsQuery = useMemoFirebase(() => {
    if (
      !firestore ||
      !user ||
      isSubscriptionLoading ||
      subscription?.planId !== 'premium'
    ) {
      return null;
    }
    return query(
      collection(firestore, 'users', user.uid, 'projects'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [firestore, user, subscription, isSubscriptionLoading]);

  const {
    data: projects,
    isLoading: isProjectsLoading,
    error,
  } = useCollection(projectsQuery);

  const isLoading = isUserLoading || isSubscriptionLoading;
  const isPremium = subscription?.planId === 'premium';

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Riwayat Projek
        </h1>
        <p className="mt-2 text-muted-foreground">
          Temukan dan kelola semua hasil kerja yang telah Anda simpan di sini.
        </p>
      </div>

      {!isPremium && (
        <>
          <PremiumLockPopup
            open={isPopupOpen}
            onOpenChange={setIsPopupOpen}
            featureName="Riwayat Projek"
            description="Simpan semua hasil kerjamu, mulai dari kerangka presentasi hingga ringkasan jurnal, dan akses kapan saja. Upgrade ke Premium untuk membuka fitur ini!"
          />
          <Card className="border-primary/50 bg-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <Sparkles className="h-6 w-6" />
                <span>Fitur Eksklusif Premium</span>
              </CardTitle>
              <CardDescription className="text-primary/80">
                Fitur Riwayat Projek memungkinkan Anda menyimpan semua pekerjaan
                Anda dengan aman.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Jangan khawatir kehilangan ide cemerlang atau ringkasan penting
                lagi. Dengan paket Premium, semua hasil generasimu akan
                tersimpan rapi di sini, siap untuk diakses kapan pun kamu butuh.
              </p>
              <Button onClick={() => setIsPopupOpen(true)}>
                Lihat Keuntungan Premium
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-6 w-6" />
              <span>Projek Tersimpan</span>
            </CardTitle>
            <CardDescription>
              Menampilkan 50 projek terakhir Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProjectsLoading && (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!isProjectsLoading && error && (
              <div className="flex h-40 flex-col items-center justify-center gap-4 text-destructive">
                <AlertCircle className="h-8 w-8" />
                <p className="font-semibold">Gagal memuat projek</p>
                <p className="text-sm">{error.message}</p>
              </div>
            )}
            {!isProjectsLoading && projects && (
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <div className="h-40 text-center flex flex-col justify-center items-center">
                    <Archive className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                    <p className="font-semibold">Belum Ada Projek Tersimpan</p>
                    <p className="text-sm text-muted-foreground">Mulai gunakan fitur untuk menyimpan projekmu di sini.</p>
                  </div>
                ) : (
                  <p>
                    Akan menampilkan daftar proyek di sini... (Total: {projects.length}
                    )
                  </p>
                  // TODO: Render the actual project list here
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
