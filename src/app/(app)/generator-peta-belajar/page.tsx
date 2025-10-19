
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
import { generateLearningPath } from '@/ai/flows/learning-path-generator';
import type { LearningPathOutput } from '@/ai/flows/learning-path-generator';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  topic: z
    .string()
    .min(3, 'Silakan masukkan topik dengan setidaknya 3 karakter.')
    .max(100, 'Topik terlalu panjang. Harap pertahankan di bawah 100 karakter.'),
});

export default function LearningPathGeneratorPage() {
  const [result, setResult] = useState<LearningPathOutput | null>(null);
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
      const response = await generateLearningPath(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal membuat peta jalan belajar. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Generator Peta Jalan Belajar
        </h1>
        <p className="mt-2 text-muted-foreground">
          Masukkan topik yang ingin Anda kuasai, dan AI akan membuatkan peta
          jalan belajar yang terstruktur untuk Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Topik Belajar
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topik yang Ingin Dipelajari</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="misalnya, 'pengembangan frontend' atau 'machine learning'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      AI akan membuatkan panduan belajar langkah demi langkah.
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
                Buat Peta Jalan
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Peta Jalan yang Dihasilkan
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
                  dangerouslySetInnerHTML={{ __html: result.learningPath }}
                />
              )}
              {!isLoading && !result && (
                <p className="pt-16 text-center text-muted-foreground">
                  Peta jalan belajar Anda akan muncul di sini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
