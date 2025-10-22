
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { summarizeDocument } from '@/ai/flows/document-summarizer';
import type { DocumentSummarizerOutput } from '@/ai/flows/document-summarizer';
import {
  Loader2,
  UploadCloud,
  BookDown,
  Sparkles,
  ClipboardList,
  Target,
} from 'lucide-react';

const formSchema = z.object({
  document: z
    .any()
    .refine((files) => files?.length === 1, 'File dokumen harus diunggah.'),
});

const toDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function DocumentSummarizerPage() {
  const [result, setResult] = useState<DocumentSummarizerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [fileName, setFileName] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('document');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const file = values.document[0];
    if (!file) {
      toast({
        title: 'Error',
        description: 'Silakan unggah file dokumen Anda.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const documentDataUri = await toDataUri(file);
      const response = await summarizeDocument({ documentDataUri });
      setResult(response);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || '';
      if (errorMessage.includes('503')) {
        toast({
          title: 'Model AI Sibuk',
          description: 'Model AI sedang kelebihan beban. Silakan coba lagi beberapa saat.',
          variant: 'destructive',
        });
      } else if (errorMessage.includes('413')) {
        toast({
          title: 'File Terlalu Besar',
          description:
            'Ukuran file Anda melebihi batas. Coba unggah file yang lebih kecil.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Terjadi Kesalahan',
          description:
            'Gagal meringkas dokumen. Silakan coba lagi nanti.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Peringkas Dokumen
        </h1>
        <p className="mt-2 text-muted-foreground">
          Unggah dokumen PDF atau Word Anda untuk mendapatkan ringkasan dan kesimpulan instan dengan gaya bahasa yang santai.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-6 w-6" />
              <span>Unggah Dokumen</span>
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
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Dokumen</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            accept=".pdf,.doc,.docx"
                            {...fileRef}
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              setFileName(e.target.files?.[0]?.name ?? '');
                            }}
                          />
                          <div className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background/50 text-center hover:bg-accent">
                            <BookDown className="mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {fileName ||
                                'Seret & lepas atau klik untuk mengunggah'}
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Unggah file PDF, DOC, atau DOCX.
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
                      <Sparkles className="mr-2 h-4 w-4" />
                      Rangkum Dokumen Saya
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              <span>Hasil Rangkuman</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] space-y-6">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center pt-16">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  AI sedang membaca dan meringkas dokumen Anda...
                </p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg font-semibold">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <span>Ringkasan</span>
                  </h3>
                  <p className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                    {result.summary}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-3 font-headline text-lg font-semibold">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Kesimpulan</span>
                  </h3>
                  <p className="rounded-md border bg-muted/30 p-4 text-sm font-bold leading-relaxed">
                    {result.conclusion}
                  </p>
                </div>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Ringkasan dan kesimpulan akan muncul di sini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
