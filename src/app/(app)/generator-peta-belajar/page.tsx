
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
import { generateLearningPath } from '@/ai/flows/learning-path-generator';
import type { LearningPathOutput } from '@/ai/flows/learning-path-generator';
import { Loader2, Wand2, Milestone, LinkIcon, BookOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';

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
        description: 'Gagal membuat roadmap belajar. Silakan coba lagi.',
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
          Generator Roadmap Belajar
        </h1>
        <p className="mt-2 text-muted-foreground">
          Masukkan topik yang ingin Anda kuasai, dan AI akan membuatkan roadmap
          belajar yang terstruktur untuk Anda, lengkap dengan sumber belajar.
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
                Buat Roadmap
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">
            Roadmap yang Dihasilkan
          </h2>
          <div className="min-h-[400px] rounded-lg border bg-card p-4 shadow-sm">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  AI sedang membuat roadmap belajar...
                </p>
              </div>
            )}
            {result && result.path.length > 0 && (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-0"
              >
                {result.path.map((step, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-primary/10 p-2 text-primary">
                          <Milestone className="h-5 w-5" />
                        </div>
                        {step.stepTitle}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4"/>
                            Konsep Kunci
                        </h4>
                        <ul className="ml-5 mt-2 list-disc space-y-2 text-sm">
                            {step.subPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                            ))}
                        </ul>
                      </div>
                       {step.resources && step.resources.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <LinkIcon className="h-4 w-4"/>
                                Rekomendasi Sumber Belajar
                            </h4>
                             <div className="space-y-2">
                                {step.resources.map((resource, i) => (
                                    <Link 
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={i}
                                        className="text-sm text-primary underline-offset-4 hover:underline flex items-center gap-2"
                                    >
                                       <span>{resource.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                       )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {!isLoading && !result && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Roadmap belajar Anda akan muncul di sini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
