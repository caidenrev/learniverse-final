
'use client';

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
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Nama harus memiliki setidaknya 2 karakter.'),
  email: z.string().email('Harap masukkan alamat email yang valid.'),
  message: z
    .string()
    .min(10, 'Pesan harus memiliki setidaknya 10 karakter.')
    .max(500, 'Pesan tidak boleh lebih dari 500 karakter.'),
});

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate form submission
    console.log(values);
    toast({
      title: 'Pesan Terkirim!',
      description: 'Terima kasih telah menghubungi kami. Kami akan segera merespons.',
    });
    form.reset();
  }

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Hubungi Kami
        </h1>
        <p className="mt-2 text-muted-foreground">
          Punya pertanyaan atau masukan? Kami ingin mendengarnya dari Anda.
        </p>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Kirim Pesan</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Anda</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Anda</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan Anda</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tulis pesan Anda di sini..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Kirim Pesan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
