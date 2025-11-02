
'use client';

import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
} from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, ArrowRight, BrainCircuit, Quote, Terminal, Sparkles, Gem } from 'lucide-react';
import Link from 'next/link';

const PARAPHRASE_LIMIT = 10;
const CODE_REVIEW_LIMIT = 10;

function getFirstName(name: string | null | undefined): string {
    if (!name) return 'Sobat Akademis';
    return name.split(' ')[0];
}

const featureShortcuts = [
    {
        title: "Brainstorm Topik",
        description: "Mulai proyekmu dengan ide-ide cemerlang dari AI.",
        href: "/brainstorm-topik",
        icon: <BrainCircuit className="h-6 w-6 text-primary" />,
        cta: "Cari Ide"
    },
    {
        title: "Parafrase Akademik",
        description: "Ubah susunan kalimat dari jurnal untuk hindari plagiarisme.",
        href: "/parafrase-akademik",
        icon: <Quote className="h-6 w-6 text-primary" />,
        cta: "Parafrase Sekarang"
    },
    {
        title: "Code Review",
        description: "Jalankan kode dan dapatkan penjelasan jika terjadi error.",
        href: "/code-review",
        icon: <Terminal className="h-6 w-6 text-primary" />,
        cta: "Cek Kode"
    }
];


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const subscriptionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'subscriptions', 'default');
  }, [firestore, user]);

  const { data: subscription, isLoading: isSubscriptionLoading } =
    useDoc(subscriptionRef);
    
  const isLoading = isUserLoading || isSubscriptionLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-10 w-1/2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
        </div>
      </div>
    );
  }

  const isPremium = subscription?.planId === 'premium';
  const remainingParaphrases = PARAPHRASE_LIMIT - (subscription?.usage?.paraphraseCount || 0);
  const remainingCodeReviews = CODE_REVIEW_LIMIT - (subscription?.usage?.codeReviewCount || 0);

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Selamat Datang Kembali, {getFirstName(user?.displayName)}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Siap untuk meningkatkan produktivitas akademismu hari ini?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Paket</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{subscription?.planId || 'Gratis'}</div>
            <p className="text-xs text-muted-foreground">
              {isPremium ? 'Akses tanpa batas ke semua fitur' : 'Dengan batas penggunaan harian'}
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sisa Kuota Parafrase</CardTitle>
            <Quote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {isPremium ? '∞' : `${remainingParaphrases < 0 ? 0 : remainingParaphrases}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPremium ? 'Nikmati parafrase tanpa batas!' : `dari ${PARAPHRASE_LIMIT} penggunaan harian`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sisa Kuota Code Review</CardTitle>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                 {isPremium ? '∞' : `${remainingCodeReviews < 0 ? 0 : remainingCodeReviews}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPremium ? 'Review kode sepuasnya!' : `dari ${CODE_REVIEW_LIMIT} penggunaan harian`}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold">Pintasan Fitur</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featureShortcuts.map((feature) => (
                <Card key={feature.title} className="flex flex-col transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="rounded-lg bg-primary/10 p-3 w-fit text-primary mb-4">
                                  {feature.icon}
                                </div>
                                <CardTitle className="font-semibold text-lg">{feature.title}</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button asChild className="w-full">
                           <Link href={feature.href}>{feature.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
      </div>
      
      {!isPremium && (
          <Card className="border-primary/50 bg-primary/10">
              <CardContent className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
                 <div className="flex items-center gap-4">
                    <div className="hidden rounded-full bg-primary/20 p-3 text-primary sm:block">
                        <Gem className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary">Buka Potensi Penuh Learniverse</h3>
                        <p className="text-sm text-primary/80">Dapatkan akses tanpa batas ke semua fitur, model AI yang lebih canggih, dan simpan riwayat kerjamu.</p>
                    </div>
                 </div>
                  <Button asChild className="w-full flex-shrink-0 md:w-auto">
                    <Link href="/pricing">Upgrade ke Premium</Link>
                  </Button>
              </CardContent>
          </Card>
      )}

    </div>
  );
}
