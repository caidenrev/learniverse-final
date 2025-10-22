
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { summarize } from '@/ai/flows/summarizer';
import type { SummarizeOutput } from '@/ai/flows/summarizer';
import { Loader2, Wand2, ShieldAlert } from 'lucide-react';
import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
} from '@/firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import Link from 'next/link';

const formSchema = z.object({
  text: z
    .string()
    .min(50, 'Harap masukkan setidaknya 50 karakter untuk diringkas.')
    .max(3000, 'Teks terlalu panjang. Harap pertahankan di bawah 3000 karakter.'),
});

const USAGE_LIMIT = 3;

export default function SummarizerPage() {
  const [result, setResult] = useState<SummarizeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const subscriptionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'subscriptions', 'default');
  }, [firestore, user]);

  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
  } = useDoc(subscriptionRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  const remainingSummaries =
    USAGE_LIMIT - (subscription?.usage?.summaryCount || 0);
  const isLimitReached = remainingSummaries <= 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        title: 'Anda harus login',
        description: 'Silakan login untuk menggunakan fitur ini.',
        variant: 'destructive',
      });
      return;
    }

    if (isLimitReached) {
      toast({
        title: 'Kuota Harian Habis',
        description: 'Anda telah mencapai batas ringkasan harian. Silakan upgrade.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await summarize(values);
      setResult(response);

      // Increment usage count in Firestore
      if (subscriptionRef) {
        await updateDoc(subscriptionRef, {
          'usage.summaryCount': increment(1),
        });
        toast({
          title: 'Berhasil Meringkas!',
          description: `Sisa kuota hari ini: ${remainingSummaries - 1}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal meringkas teks. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Peringkas Jurnal
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pahami jurnal akademis berbahasa Inggris yang kompleks dengan cepat.
          Dapatkan poin-poin penting yang diringkas dalam Bahasa Indonesia yang
          mudah dipahami.
        </p>
      </div>

      {user && !isSubscriptionLoading && isLimitReached && (
        <Card className="border-amber-500 bg-amber-50/50">
          <CardContent className="flex items-center gap-4 p-4">
            <ShieldAlert className="h-8 w-8 text-amber-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">
                Kuota Gratis Anda Telah Habis
              </h3>
              <p className="text-sm text-amber-700">
                Upgrade ke paket Premium untuk mendapatkan ringkasan tanpa batas
                dan akses fitur canggih lainnya.
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing">Upgrade Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Teks Bahasa Inggris
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Abstrak atau teks dari jurnal berbahasa Inggris
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tempel abstrak atau bagian dari jurnal di sini..."
                        className="min-h-[200px]"
                        {...field}
                        disabled={isLimitReached}
                      />
                    </FormControl>
                    <FormDescription>
                      AI akan membaca ini dan memberikan ringkasan dalam Bahasa
                      Indonesia.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || isLimitReached}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Ringkas
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Ringkasan (dalam Bahasa Indonesia)
          </h2>
          <Card className="min-h-[240px]">
            <CardContent className="p-6">
              {isLoading && (
                <div className="flex items-center justify-center pt-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              )}
              {result && (
                <div
                  className="prose prose-sm max-w-none whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: result.summary }}
                />
              )}
              {!isLoading && !result && (
                <p className="pt-16 text-center text-muted-foreground">
                  Ringkasan akan muncul di sini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
