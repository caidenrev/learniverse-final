
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
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Archive,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { PremiumLockPopup } from '@/components/premium-lock-popup';
import { menuItems } from '@/lib/menu-items';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// Helper to find the icon for a given feature title
const getFeatureIcon = (featureName: string) => {
  for (const group of menuItems) {
    const item = group.items.find((i) => i.title === featureName);
    if (item) {
      return <item.icon className="h-5 w-5" />;
    }
  }
  return <Sparkles className="h-5 w-5" />; // Default icon
};

function ProjectItem({ project }: { project: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                {getFeatureIcon(project.feature)}
                <span>{project.feature}</span>
              </div>
              <span className="text-muted-foreground/80">
                &middot; Dibuat{' '}
                {formatDistanceToNow(project.createdAt.toDate(), {
                  addSuffix: true,
                  locale: id,
                })}
              </span>
            </CardDescription>
          </div>
          <Badge variant={project.isSaved ? 'default' : 'secondary'}>
            {project.isSaved ? 'Disimpan' : 'Baru'}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
          Lihat Detail
        </Button>
        <Button asChild>
          <Link href="#">
            <ChevronRight className="mr-2 h-4 w-4" />
            Gunakan Lagi
          </Link>
        </Button>
      </CardFooter>
      {isExpanded && (
        <CardContent className="border-t pt-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Input:</h4>
              <pre className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-2 text-xs font-mono">
                {JSON.stringify(project.input, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold">Output:</h4>
              <pre className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-2 text-xs font-mono">
                {JSON.stringify(project.output, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

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
        <div className="space-y-6">
          {isProjectsLoading && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Memuat projek Anda...</p>
            </div>
          )}
          {!isProjectsLoading && error && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-destructive">
              <AlertCircle className="h-8 w-8" />
              <p className="font-semibold">Gagal memuat projek</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}
          {!isProjectsLoading && projects && (
            <>
              {projects.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center gap-4 rounded-lg border border-dashed text-center">
                  <Archive className="h-12 w-12 text-muted-foreground/50" />
                  <p className="font-semibold">Belum Ada Projek Tersimpan</p>
                  <p className="text-sm text-muted-foreground">
                    Mulai gunakan fitur untuk menyimpan projekmu di sini.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {projects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
