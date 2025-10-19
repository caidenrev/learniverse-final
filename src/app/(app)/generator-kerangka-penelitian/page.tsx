
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
import { generateResearchOutline } from '@/ai/flows/research-outline-generator';
import type { ResearchOutlineOutput } from '@/ai/flows/research-outline-generator';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  topic: z
    .string()
    .min(10, 'Silakan masukkan topik dengan setidaknya 10 karakter.')
    .max(200, 'Topik terlalu panjang. Harap pertahankan di bawah 200 karakter.'),
});

export default function ResearchOutlineGeneratorPage() {
  const [result, setResult] = useState<ResearchOutlineOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateResearchOutline(values);
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
          Kerangka Penelitian
        </h1>
        <p className="mt-2 text-muted-foreground">
          Mulailah skripsi atau makalah penelitian Anda. Berikan topik dan
          dapatkan draf struktur yang umum digunakan di universitas-universitas
          Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Topik Penelitian
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topik Utama</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="misalnya, 'Analisis Sentimen Pengguna E-Commerce di Indonesia'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Subjek inti dari proposal penelitian atau skripsi Anda.
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
            Kerangka yang Dihasilkan (dalam Bahasa Indonesia)
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
