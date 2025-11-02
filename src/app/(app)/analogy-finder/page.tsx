
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
import { analogyFinder } from '@/ai/flows/analogy-finder';
import type { AnalogyFinderOutput } from '@/ai/flows/analogy-finder';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  technicalConcept: z
    .string()
    .min(3, 'Silakan masukkan konsep dengan setidaknya 3 karakter.')
    .max(100, 'Konsep terlalu panjang. Harap pertahankan di bawah 100 karakter.'),
});

export default function AnalogyFinderPage() {
  const [result, setResult] = useState<AnalogyFinderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { technicalConcept: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await analogyFinder(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal menemukan analogi. Silakan coba lagi.',
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
          Pencari Analogi
        </h1>
        <p className="mt-2 text-muted-foreground">
          Kesulitan menjelaskan topik yang rumit? Temukan analogi sederhana
          untuk membuat konsep teknis apa pun mudah dipahami.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Konsepnya
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="technicalConcept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konsep Teknis</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="misalnya, 'Apa itu API?'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Masukkan ide kompleks yang ingin Anda sederhanakan.
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
                Temukan Analogi
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Analogi yang Dihasilkan
          </h2>
          <Card className="min-h-[240px]">
            <CardContent className="p-6">
              {isLoading && (
                <div className="flex items-center justify-center pt-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              )}
              {result && (
                <p className="leading-relaxed">{result.analogy}</p>
              )}
              {!isLoading && !result && (
                <p className="pt-16 text-center text-muted-foreground">
                  Analogi yang Anda hasilkan akan muncul di sini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
