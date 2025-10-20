
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
import { useToast } from '@/hooks/use-toast';
import { generateResearchOutline } from '@/ai/flows/research-outline-generator';
import type { ResearchOutlineOutput } from '@/ai/flows/research-outline-generator';
import { Loader2, Wand2, BookOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
            Kerangka yang Dihasilkan
          </h2>
          <div className="min-h-[400px] rounded-lg border bg-card p-4 shadow-sm">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  AI sedang menyusun kerangka penelitian...
                </p>
              </div>
            )}
            {result && result.outline.length > 0 && (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-0"
              >
                {result.outline.map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-primary/10 p-2 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        {section.sectionTitle}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <ul className="ml-5 mt-2 list-disc space-y-2 text-sm">
                        {section.contentPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Kerangka penelitian Anda akan muncul di sini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
