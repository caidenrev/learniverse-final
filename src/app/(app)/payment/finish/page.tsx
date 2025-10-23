
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
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
import { Suspense, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

function PaymentStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const orderId = searchParams.get('order_id');
  const statusCode = searchParams.get('status_code');
  const transactionStatus = searchParams.get('transaction_status');

  useEffect(() => {
    if (isUserLoading || !firestore || !user || !orderId) return;

    const updateTransaction = async () => {
      const transactionRef = doc(firestore, 'users', user.uid, 'transactions', orderId);
      const transactionSnap = await getDoc(transactionRef);

      if (!transactionSnap.exists() || transactionSnap.data().status === 'success') {
        return; // Don't update if it doesn't exist or is already successful
      }
      
      let newStatus = transactionSnap.data().status;
      switch (transactionStatus) {
          case 'capture':
          case 'settlement':
            newStatus = 'success';
            // Also update the subscription
            const subscriptionRef = doc(firestore, 'users', user.uid, 'subscriptions', 'default');
            await updateDoc(subscriptionRef, {
                planId: 'premium',
                status: 'active',
                currentPeriodEnd: null, // Or set an expiry date
            });
            break;
          case 'deny':
          case 'failure':
            newStatus = 'failed';
            break;
          case 'cancel':
            newStatus = 'cancelled';
            break;
          case 'expire':
            newStatus = 'expired';
            break;
          default: // pending or other states
            newStatus = 'pending';
      }

      if(newStatus !== transactionSnap.data().status) {
         await updateDoc(transactionRef, {
            status: newStatus,
            updatedAt: serverTimestamp(),
        });
      }
    };

    updateTransaction();

    // Redirect to transaction history to see the result
    const timer = setTimeout(() => {
        router.replace('/riwayat-transaksi');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);

  }, [orderId, transactionStatus, statusCode, isUserLoading, firestore, user, router]);


  let statusDetails = {
    icon: <Loader2 className="h-16 w-16 animate-spin text-gray-400" />,
    title: 'Memproses Pembayaran...',
    message:
      'Kami sedang memverifikasi status pembayaran Anda. Anda akan segera diarahkan.',
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
            'Terima kasih! Paket premium Anda telah aktif. Anda akan diarahkan ke riwayat transaksi.',
          color: 'text-green-600',
        };
      }
      break;
    case 'pending':
      statusDetails = {
        icon: <Clock className="h-16 w-16 text-yellow-500" />,
        title: 'Pembayaran Tertunda',
        message: `Kami menunggu konfirmasi pembayaran Anda. Status akan diperbarui di riwayat transaksi.`,
        color: 'text-yellow-600',
      };
      break;
    case 'deny':
       statusDetails = {
        icon: <XCircle className="h-16 w-16 text-red-500" />,
        title: 'Pembayaran Ditolak',
        message: `Pembayaran Anda ditolak. Anda akan diarahkan ke riwayat transaksi.`,
        color: 'text-red-600',
      };
      break;
    case 'cancel':
    case 'expire':
      statusDetails = {
        icon: <AlertTriangle className="h-16 w-16 text-orange-500" />,
        title: 'Pembayaran Dibatalkan atau Kedaluwarsa',
        message: `Pesanan Anda telah dibatalkan atau kedaluwarsa. Anda akan diarahkan.`,
        color: 'text-orange-600',
      };
      break;
    default:
      // This handles cases where user clicks "Back to merchant" without completing
      statusDetails = {
        icon: <AlertTriangle className="h-16 w-16 text-gray-500" />,
        title: 'Belum Selesai',
        message: 'Anda kembali sebelum menyelesaikan proses pembayaran. Anda akan diarahkan.',
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
              <Link href="/riwayat-transaksi">Lihat Riwayat Transaksi</Link>
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
