
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
import { generateQuestions } from '@/ai/flows/question-generator';
import type { QuestionGeneratorOutput } from '@/ai/flows/question-generator-schemas';
import { Loader2, UploadCloud, FileQuestion, Sparkles } from 'lucide-react';

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

export default function QuestionGeneratorPage() {
  const [result, setResult] = useState<QuestionGeneratorOutput | null>(null);
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
      const response = await generateQuestions({ documentDataUri });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal membuat pertanyaan. Silakan coba lagi.',
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
          Pembuat Pertanyaan
        </h1>
        <p className="mt-2 text-muted-foreground">
          Unggah materi pelajaran (PDF) dan biarkan AI membuatkan daftar
          pertanyaan untuk kuis atau bahan diskusi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-6 w-6" />
              <span>Unggah Materi</span>
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
                      <FormLabel>File Materi</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            accept=".pdf"
                            {...fileRef}
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              setFileName(e.target.files?.[0]?.name ?? '');
                            }}
                          />
                          <div className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-input bg-background/50 text-center hover:bg-accent">
                            <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {fileName ||
                                'Seret & lepas atau klik untuk mengunggah'}
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Unggah file PDF Anda.
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
                      Buat Pertanyaan
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
              <FileQuestion className="h-6 w-6" />
              <span>Daftar Pertanyaan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[360px] space-y-6">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center pt-16">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  AI sedang menganalisis dokumen dan membuat pertanyaan...
                </p>
              </div>
            )}
            {result && (
              <ol className="list-inside list-none space-y-4">
                {result.questions.map((question, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 rounded-lg border bg-background/50 p-4"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="flex-1 leading-relaxed">{question}</p>
                  </li>
                ))}
              </ol>
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Pertanyaan yang dihasilkan akan muncul di sini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
