
'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="text-green-500">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Pembayaran Berhasil!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Terima kasih telah berlangganan Learniverse Premium! Akun Anda telah
            di-upgrade. Anda sekarang dapat menikmati semua fitur tanpa batas.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/brainstorm-topik">Mulai Gunakan Fitur Premium</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
