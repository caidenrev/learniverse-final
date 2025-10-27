
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  CheckCircle2,
  XCircle,
  Gem,
  Sparkles,
  Loader2,
  Ticket,
} from 'lucide-react';
import Link from 'next/link';
import {
  useUser,
  useFirestore,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { createPayment } from '@/ai/flows/create-payment';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const freeFeatures = [
  { text: '10 ringkasan jurnal per hari', included: true },
  { text: 'Parafrase hingga 10 kali per hari', included: true },
  { text: 'Code review hingga 10 kali per hari', included: true },
  { text: 'Akses ke semua fitur dasar', included: true },
];

const premiumFeatures = [
  { text: 'Ringkasan & parafrase tanpa batas', included: true },
  { text: 'Akses ke model AI yang lebih canggih & akurat', included: true },
  { text: 'Code review tanpa batas', included: true },
  { text: 'Fitur kolaborasi tim (segera hadir)', included: true },
  { text: 'Dukungan prioritas', included: true },
];

const VOUCHER_CODE = 'LEARNIVERSE25';

export default function PricingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);

  async function handleUpgrade() {
    if (!user || !firestore) {
      toast({
        title: 'Harus Login',
        description: 'Anda harus login untuk bisa upgrade ke Premium.',
        variant: 'destructive',
      });
      return;
    }

    setIsRedirecting(true);

    try {
      const planId = 'premium';
      const amount = 10000; // Updated price

      const paymentInput = {
        userId: user.uid,
        planId: planId,
        amount: amount,
        user: {
          name: user.displayName || 'Pengguna Learniverse',
          email: user.email || 'no-email@learniverse.com',
        },
      };

      // 1. Create payment link and get orderId from the flow
      const result = await createPayment(paymentInput);

      if (result.paymentUrl && result.orderId) {
        // 2. Save the transaction to Firestore with 'pending' status
        const transactionRef = doc(
          firestore,
          'users',
          user.uid,
          'transactions',
          result.orderId
        );
        const transactionData = {
          orderId: result.orderId,
          userId: user.uid,
          planId: planId,
          amount: amount,
          status: 'pending',
          paymentUrl: result.paymentUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(transactionRef, transactionData).catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: transactionRef.path,
            operation: 'create',
            requestResourceData: transactionData,
          });
          errorEmitter.emit('permission-error', permissionError);
          // Re-throw to be caught by the outer catch block
          throw new Error('Gagal menyimpan transaksi ke database.');
        });

        // 3. Redirect user to payment page
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(
          'URL pembayaran atau Order ID tidak diterima dari server.'
        );
      }
    } catch (error: any) {
      console.error('Payment process failed:', error);
      toast({
        title: 'Proses Upgrade Gagal',
        description:
          error.message ||
          'Terjadi kesalahan saat memulai proses pembayaran. Silakan coba lagi.',
        variant: 'destructive',
      });
      setIsRedirecting(false);
    }
  }

  async function handleVoucherRedeem() {
    if (!user || !firestore) {
      toast({
        title: 'Harus Login',
        description: 'Anda harus login untuk bisa menggunakan voucher.',
        variant: 'destructive',
      });
      return;
    }

    setIsVoucherLoading(true);

    if (voucherInput === VOUCHER_CODE) {
      try {
        const subscriptionRef = doc(
          firestore,
          'users',
          user.uid,
          'subscriptions',
          'default'
        );
        await updateDoc(subscriptionRef, {
          planId: 'premium',
          status: 'active',
        });
        toast({
          title: 'Voucher Berhasil Digunakan!',
          description:
            'Akun Anda telah di-upgrade ke Premium. Selamat menikmati!',
        });
        router.push('/brainstorm-topik');
      } catch (error: any) {
        console.error('Voucher redeem failed:', error);
        toast({
          title: 'Gagal Menggunakan Voucher',
          description:
            'Terjadi kesalahan saat meng-upgrade akun Anda. Silakan coba lagi.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Kode Voucher Salah',
        description: 'Pastikan Anda memasukkan kode voucher yang benar.',
        variant: 'destructive',
      });
    }

    setIsVoucherLoading(false);
  }

  return (
    <div className="container space-y-8 py-16">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Pilih Paket yang Tepat untuk Anda
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Mulai secara gratis dan upgrade kapan pun Anda membutuhkan fitur yang
          lebih canggih untuk mendukung perjalanan akademis Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Free Plan Card */}
        <Card className="flex flex-col border-gray-200 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <span className="font-headline text-2xl">Gratis</span>
            </CardTitle>
            <CardDescription>
              Cocok untuk memulai dan mencoba fitur-fitur dasar Learniverse.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="font-headline text-4xl font-bold">
              Rp 0
              <span className="text-lg font-normal text-muted-foreground">
                /bulan
              </span>
            </p>
            <ul className="space-y-3">
              {freeFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>{feature.text}</span>
                </li>
              ))}
              <li className="flex items-center gap-3 text-muted-foreground">
                <XCircle className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <span>Akses ke model AI canggih</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <XCircle className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <span>Simpan riwayat & proyek</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/brainstorm-topik">Lanjutkan dengan Gratis</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan Card */}
        <Card className="relative flex flex-col border-2 border-primary shadow-lg shadow-primary/20">
          <Badge
            variant="destructive"
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            Promo Mahasiswa
          </Badge>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <Gem className="h-6 w-6 text-primary" />
              <span className="font-headline text-2xl">Premium</span>
            </CardTitle>
            <CardDescription>
              Untuk mahasiswa dan profesional yang membutuhkan kekuatan AI tanpa
              batas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-4xl font-bold">Rp 10rb</span>
              <span className="text-xl font-medium text-muted-foreground line-through">
                Rp 50rb
              </span>
            </div>
            <p className="text-lg font-normal text-muted-foreground -mt-2">
              /bulan
            </p>
            <ul className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 font-medium"
                >
                  <Sparkles className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full font-bold"
              onClick={handleUpgrade}
              disabled={isUserLoading || isRedirecting}
            >
              {isRedirecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isRedirecting ? 'Mengarahkan...' : 'Upgrade ke Premium'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Voucher Card */}
      <Card className="mx-auto max-w-2xl border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Ticket className="h-6 w-6" />
            <span>Punya Kode Voucher?</span>
          </CardTitle>
          <CardDescription>
            Masukkan kode voucher di bawah ini untuk mengaktifkan paket
            premium Anda sementara waktu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="voucher" className="sr-only">
                Kode Voucher
              </Label>
              <Input
                id="voucher"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                disabled={isVoucherLoading}
              />
            </div>
            <Button
              onClick={handleVoucherRedeem}
              disabled={isUserLoading || isVoucherLoading}
            >
              {isVoucherLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Aktifkan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
