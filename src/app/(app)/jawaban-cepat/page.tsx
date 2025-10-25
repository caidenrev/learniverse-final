
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
import { answerAllQuestions } from '@/ai/flows/question-answerer';
import type { QuestionAnswererOutput } from '@/ai/flows/question-answerer';
import { Loader2, UploadCloud, FileCheck, Sparkles, HelpCircle, Bot } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  document: z
    .any()
    .refine((files) => files?.length === 1, 'File materi harus diunggah.'),
});

const toDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function QuickAnswerPage() {
  const [result, setResult] = useState<QuestionAnswererOutput | null>(null);
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
        description: 'Silakan unggah file materi Anda.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const documentDataUri = await toDataUri(file);
      const response = await answerAllQuestions({ documentDataUri });
      setResult(response);
      if (response.qaPairs.length === 0) {
        toast({
            title: 'Tidak Ada Pertanyaan Ditemukan',
            description: 'AI tidak dapat menemukan pertanyaan apa pun di dalam dokumen.',
        });
      }
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
            'Gagal menjawab pertanyaan. Silakan coba lagi nanti.',
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
          Jawaban Cepat
        </h1>
        <p className="mt-2 text-muted-foreground">
          Unggah dokumen (PDF/JPG) yang berisi soal, dan biarkan AI menjawab semuanya untuk Anda dengan gaya bahasa yang santai.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-6 w-6" />
              <span>Unggah Dokumen Soal</span>
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
                      <FormLabel>File Soal</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            accept=".pdf,.jpg,.jpeg,.png"
                            {...fileRef}
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              setFileName(e.target.files?.[0]?.name ?? '');
                            }}
                          />
                          <div className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background/50 text-center hover:bg-accent">
                            <FileCheck className="mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {fileName ||
                                'Seret & lepas atau klik untuk mengunggah'}
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Unggah file PDF atau gambar (JPG, PNG) Anda.
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
                      Dapatkan Jawaban
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
              <span>Hasil Jawaban</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center pt-16">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  AI sedang membaca soal dan menyiapkan jawaban...
                </p>
              </div>
            )}
            {result && result.qaPairs.length > 0 && (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-0"
              >
                {result.qaPairs.map((pair, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      <div className="flex items-start gap-3">
                         <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                            {index + 1}
                         </div>
                         <span>{pair.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                       <div className="flex items-start gap-3 rounded-md border bg-background/50 p-4">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </div>
                          <p className="flex-1 leading-relaxed text-sm">{pair.answer}</p>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Jawaban dari AI akan muncul di sini.
                </p>
              </div>
            )}
             {result && result.qaPairs.length === 0 && !isLoading && (
                 <div className="flex h-full items-center justify-center text-center">
                    <p className="text-muted-foreground">
                        AI tidak menemukan pertanyaan di dokumen Anda.<br/>Coba dokumen lain.
                    </p>
                 </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
