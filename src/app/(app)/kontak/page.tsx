
'use client';

import { useForm, ValidationError } from '@formspree/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const [state, handleSubmit] = useForm('xpwyeynj');

  if (state.succeeded) {
    return (
      <div className="flex h-full min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="font-headline text-3xl font-bold">Pesan Terkirim!</h1>
        <p className="max-w-md text-muted-foreground">
          Terima kasih telah menghubungi. Revan akan segera merespons pesan Anda.
        </p>
      </div>
    );
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Anda</Label>
              <Input id="name" type="text" name="name" placeholder="Revan Ganteng" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Anda</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="revan.ganteng@example.com"
                required
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
                className="text-sm font-medium text-destructive"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Pesan Anda</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tulis pesan Anda di sini..."
                className="min-h-[120px]"
                required
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
                className="text-sm font-medium text-destructive"
              />
            </div>

            <Button type="submit" disabled={state.submitting}>
              <Send className="mr-2 h-4 w-4" />
              {state.submitting ? 'Mengirim...' : 'Kirim Pesan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
