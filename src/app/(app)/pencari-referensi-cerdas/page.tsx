
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
import { smartReferenceFinder } from '@/ai/flows/smart-reference-finder';
import { Loader2, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  searchTerm: z
    .string()
    .min(3, 'Silakan masukkan istilah dengan setidaknya 3 karakter.')
    .max(100, 'Istilah terlalu panjang. Harap pertahankan di bawah 100 karakter.'),
});

export default function SmartReferenceFinderPage() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { searchTerm: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await smartReferenceFinder(values.searchTerm);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal menemukan kata kunci. Silakan coba lagi.',
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
          Pencari Referensi Cerdas
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tingkatkan pencarian Google Scholar Anda. Dapatkan kata kunci
          alternatif dan terkait untuk menemukan referensi akademis yang paling
          relevan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Istilah Awal
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="searchTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Istilah atau Konsep Pencarian</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="misalnya, 'kepuasan pelanggan' atau 'kegunaan aplikasi seluler'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Masukkan istilah untuk menemukan kata kunci terkait.
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
                Temukan Kata Kunci
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Kata Kunci yang Disarankan
          </h2>
          <Card className="min-h-[240px]">
            <CardContent className="p-6">
              {isLoading && (
                <div className="flex items-center justify-center pt-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              )}
              {result && (
                <div className="flex flex-wrap gap-2">
                  {result.split(',').map((keyword) => (
                    <Badge key={keyword.trim()} variant="secondary">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              )}
              {!isLoading && !result && (
                <p className="pt-16 text-center text-muted-foreground">
                  Kata kunci yang Anda hasilkan akan muncul di sini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
