
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
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generatePresentationOutline } from '@/ai/flows/presentation-outliner';
import type { PresentationOutlineOutput } from '@/ai/flows/presentation-outliner';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Silakan masukkan judul dengan minimal 5 karakter.')
    .max(150, 'Judul terlalu panjang. Harap pertahankan di bawah 150 karakter.'),
});

export default function PresentationOutlinerPage() {
  const [result, setResult] = useState<PresentationOutlineOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generatePresentationOutline(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal membuat kerangka. Silakan coba lagi.',
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
          Kerangka Presentasi
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ubah judul presentasi Anda menjadi kerangka terstruktur, slide demi
          slide, dari pendahuluan hingga kesimpulan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Detail Presentasi
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Presentasi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="contoh, 'Masa Depan Energi Terbarukan'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Judul utama presentasi Anda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Buat Kerangka
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Kerangka yang Dihasilkan
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
                  dangerouslySetInnerHTML={{ __html: result.outline }}
                />
              )}
              {!isLoading && !result && (
                <p className="pt-16 text-center text-muted-foreground">
                  Kerangka yang Anda hasilkan akan muncul di sini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
