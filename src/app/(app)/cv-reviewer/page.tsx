
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
import { reviewCv } from '@/ai/flows/cv-reviewer';
import type { CvReviewerOutput } from '@/ai/flows/cv-reviewer';
import {
  Loader2,
  UploadCloud,
  FileText,
  Star,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  cv: z.any().refine((files) => files?.length === 1, 'File CV harus diunggah.'),
});

const toDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CvReviewerPage() {
  const [result, setResult] = useState<CvReviewerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [fileName, setFileName] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('cv');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const file = values.cv[0];
    if (!file) {
      toast({
        title: 'Error',
        description: 'Silakan unggah file CV Anda.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const cvDataUri = await toDataUri(file);
      const response = await reviewCv({ cvDataUri });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal mereview CV. Silakan coba lagi.',
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
          CV Reviewer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Dapatkan masukan instan tentang CV Anda dari AI yang bertindak sebagai
          HR.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Unggah CV Anda</span>
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
                  name="cv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File CV</FormLabel>
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
                            <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {fileName ||
                                'Seret & lepas atau klik untuk mengunggah'}
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Unggah CV Anda dalam format PDF, DOC, atau DOCX.
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
                      Review CV Saya
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
              <span>Hasil Review</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[360px] space-y-6">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center pt-16">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  AI sedang menganalisis CV Anda...
                </p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Skor CV Anda
                  </h3>
                  <div className="mt-2 flex items-center gap-3">
                    <Progress value={result.score} className="w-full" />
                    <span className="font-bold text-primary">
                      {result.score}/100
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Ulasan HR</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result.review}
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    Saran Perbaikan
                  </h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Hasil review CV Anda akan muncul di sini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
