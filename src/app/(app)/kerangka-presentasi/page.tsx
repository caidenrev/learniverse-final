
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
import { generatePresentationOutline } from '@/ai/flows/presentation-outliner';
import type { PresentationOutlineOutput } from '@/ai/flows/presentation-outliner';
import {
  Loader2,
  Wand2,
  Presentation,
  Mic,
  ListTree,
  ChevronDown,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="h-6 w-6" />
                <span>Detail Presentasi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Buat Kerangka
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
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
                  AI sedang menyusun slide Anda...
                </p>
              </div>
            )}
            {result && result.slides.length > 0 && (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-0"
              >
                {result.slides.map((slide, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-primary/10 p-2 text-primary">
                          <span className="font-bold">{index + 1}</span>
                        </div>
                        {slide.slideTitle}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <ListTree className="h-4 w-4" />
                            <span>Poin Konten</span>
                          </h4>
                          <ul className="ml-5 list-disc space-y-1 text-sm">
                            {slide.contentPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Mic className="h-4 w-4" />
                            <span>Catatan Pembicara</span>
                          </h4>
                          <p className="text-sm italic text-muted-foreground/80">
                            {slide.speakerNotes}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Kerangka presentasi Anda akan muncul di sini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
