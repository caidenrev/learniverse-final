
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
import { academicParaphraser } from '@/ai/flows/academic-paraphraser';
import type { AcademicParaphraserOutput } from '@/ai/flows/academic-paraphraser';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  text: z
    .string()
    .min(20, 'Harap masukkan setidaknya 20 karakter untuk parafrase.')
    .max(1000, 'Teks terlalu panjang. Harap pertahankan di bawah 1000 karakter.'),
});

export default function AcademicParaphraserPage() {
  const [result, setResult] = useState<AcademicParaphraserOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await academicParaphraser(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal memparafrasekan teks. Silakan coba lagi.',
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
          Parafrase Akademik
        </h1>
        <p className="mt-2 text-muted-foreground">
          Hindari plagiarisme dan tingkatkan tulisan akademis Anda. Tempelkan
          kalimat atau paragraf untuk mendapatkan versi yang disusun ulang.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">Teks Asli</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teks dari jurnal atau makalah</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tempelkan teks yang ingin Anda susun ulang di sini..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Model akan menulis ulang teks ini dengan gaya yang
                      berbeda.
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
                Parafrase Teks
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Versi Parafrasa
          </h2>
          <Card className="min-h-[240px]">
            <CardContent className="p-6">
              {isLoading && (
                <div className="flex items-center justify-center pt-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              )}
              {result && (
                <p className="leading-relaxed">{result.paraphrasedText}</p>
              )}
              {!isLoading && !result && (
                <p className="pt-16 text-center text-muted-foreground">
                  Teks yang diparafrasekan akan muncul di sini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
