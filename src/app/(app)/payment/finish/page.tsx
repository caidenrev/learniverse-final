
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function PaymentStatus() {
  const searchParams = useSearchParams();
  const transactionStatus = searchParams.get('transaction_status');
  const orderId = searchParams.get('order_id');
  const statusCode = searchParams.get('status_code');

  let statusDetails = {
    icon: <Loader2 className="h-16 w-16 animate-spin text-gray-400" />,
    title: 'Memproses Pembayaran...',
    message:
      'Kami sedang memverifikasi status pembayaran Anda. Halaman ini akan diperbarui secara otomatis.',
    color: 'text-gray-500',
  };

  switch (transactionStatus) {
    case 'capture':
    case 'settlement':
      if (statusCode === '200') {
        statusDetails = {
          icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
          title: 'Pembayaran Berhasil!',
          message:
            'Terima kasih! Paket premium Anda telah aktif. Anda sekarang dapat menikmati semua fitur tanpa batas.',
          color: 'text-green-600',
        };
      }
      break;
    case 'pending':
      statusDetails = {
        icon: <Clock className="h-16 w-16 text-yellow-500" />,
        title: 'Pembayaran Tertunda',
        message: `Kami menunggu konfirmasi pembayaran Anda untuk pesanan ${orderId}. Silakan selesaikan pembayaran Anda.`,
        color: 'text-yellow-600',
      };
      break;
    case 'deny':
      statusDetails = {
        icon: <XCircle className="h-16 w-16 text-red-500" />,
        title: 'Pembayaran Ditolak',
        message: `Sayangnya, pembayaran Anda untuk pesanan ${orderId} ditolak oleh penyedia pembayaran.`,
        color: 'text-red-600',
      };
      break;
    case 'cancel':
    case 'expire':
      statusDetails = {
        icon: <AlertTriangle className="h-16 w-16 text-orange-500" />,
        title: 'Pembayaran Dibatalkan atau Kedaluwarsa',
        message: `Pesanan Anda ${orderId} telah dibatalkan atau telah melewati batas waktu pembayaran.`,
        color: 'text-orange-600',
      };
      break;
    default:
      // This handles cases where user clicks "Back to merchant" without completing
      statusDetails = {
        icon: <AlertTriangle className="h-16 w-16 text-gray-500" />,
        title: 'Belum Selesai',
        message: 'Anda kembali sebelum menyelesaikan proses pembayaran. Silakan coba lagi jika Anda ingin melanjutkan.',
        color: 'text-gray-600',
      };
      break;
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="items-center text-center">
          <div className={statusDetails.color}>{statusDetails.icon}</div>
          <CardTitle className={`text-2xl font-bold ${statusDetails.color}`}>
            {statusDetails.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">{statusDetails.message}</p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/brainstorm-topik">Kembali ke Beranda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function FinishPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <PaymentStatus />
        </Suspense>
    )
}
