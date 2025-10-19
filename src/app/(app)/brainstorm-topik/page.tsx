
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
import { topicBrainstormer } from '@/ai/flows/topic-brainstormer';
import type { TopicBrainstormerOutput } from '@/ai/flows/topic-brainstormer';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  courseOrTheme: z
    .string()
    .min(10, 'Silakan masukkan mata kuliah atau tema dengan minimal 10 karakter.')
    .max(100, 'Input terlalu panjang. Harap pertahankan di bawah 100 karakter.'),
});

export default function TopicBrainstormerPage() {
  const [result, setResult] = useState<TopicBrainstormerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { courseOrTheme: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await topicBrainstormer(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal menghasilkan ide. Silakan coba lagi.',
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
          Brainstorm Topik
        </h1>
        <p className="mt-2 text-muted-foreground">
          Bingung mau mulai dari mana? Masukkan mata kuliah atau tema umum, dan
          biarkan AI menghasilkan ide sub-topik menarik untuk proyek Anda
          selanjutnya.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">Topik Anda</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="courseOrTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mata Kuliah atau Tema</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="contoh, 'Keamanan siber untuk pemula' atau 'Dampak media sosial pada masyarakat'"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Berikan tema untuk makalah, esai, atau presentasi Anda.
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
                Hasilkan Ide
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Ide yang Dihasilkan
          </h2>
          <Card className="min-h-[240px]">
            <CardContent className="p-6">
              {isLoading && (
                <div className="flex items-center justify-center pt-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              )}
              {result && (
                <ul className="list-inside list-disc space-y-2">
                  {result.subTopicIdeas.map((idea, index) => (
                    <li key={index}>{idea}</li>
                  ))}
                </ul>
              )}
              {!isLoading && !result && (
                <p className="pt-16 text-center text-muted-foreground">
                  Ide yang Anda hasilkan akan muncul di sini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
