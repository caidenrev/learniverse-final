
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { answerQuestion } from '@/ai/flows/ai-tutor';
import type { AiTutorOutput } from '@/ai/flows/ai-tutor-schemas';
import { Loader2, HelpCircle, UploadCloud, Bot } from 'lucide-react';

const formSchema = z.object({
  document: z.any().refine((files) => files?.length === 1, 'File is required.'),
  question: z
    .string()
    .min(10, 'Pertanyaan harus memiliki setidaknya 10 karakter.'),
});

// Helper to convert file to Data URI
const toDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AiTutorPage() {
  const [result, setResult] = useState<AiTutorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [fileName, setFileName] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: '' },
  });

  const fileRef = form.register('document');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const file = values.document[0];
    if (!file) {
      toast({
        title: 'Error',
        description: 'Silakan unggah file materi.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const documentDataUri = await toDataUri(file);
      const response = await answerQuestion({
        documentDataUri,
        question: values.question,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal mendapatkan jawaban. Silakan coba lagi.',
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
          Tutor AI
        </h1>
        <p className="mt-2 text-muted-foreground">
          Unggah materi kuliah Anda (PDF, catatan, dll.) dan ajukan pertanyaan.
          AI akan menjawab berdasarkan konten dokumen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              <span>Ajukan Pertanyaan</span>
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
                      <FormLabel>Materi Kuliah</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            accept=".pdf,.doc,.docx,.txt"
                            {...fileRef}
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              setFileName(
                                e.target.files?.[0]?.name ?? ''
                              );
                            }}
                          />
                          <div className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background/50 text-center hover:bg-accent">
                            <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {fileName ||
                                'Seret & lepas atau klik untuk mengunggah'}
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Unggah file PDF, DOCX, atau TXT Anda.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pertanyaan Anda</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="misalnya, 'Jelaskan konsep utama dari bab 3?'"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ajukan pertanyaan spesifik tentang materi yang Anda unggah.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Dapatkan Jawaban'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <span>Jawaban AI</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[360px]">
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            )}
            {result && (
              <div
                className="prose prose-sm max-w-none whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: result.answer }}
              />
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Jawaban akan muncul di sini setelah Anda mengajukan
                  pertanyaan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
