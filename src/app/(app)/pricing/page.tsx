'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, Gem, Sparkles } from 'lucide-react';
import Link from 'next/link';

const freeFeatures = [
  { text: '3 ringkasan jurnal per hari', included: true },
  { text: 'Parafrase hingga 500 kata', included: true },
  { text: '10 pertanyaan ke Tutor AI per hari', included: true },
  { text: 'Akses ke semua fitur dasar', included: true },
];

const premiumFeatures = [
  { text: 'Ringkasan & parafrase tanpa batas', included: true },
  { text: 'Akses ke model AI yang lebih canggih & akurat', included: true },
  { text: 'Reviewer CV yang lebih mendalam', included: true },
  { text: 'Simpan riwayat dan proyek Anda', included: true },
  { text: 'Fitur kolaborasi tim (segera hadir)', included: true },
  { text: 'Dukungan prioritas', included: true },
];

export default function PricingPage() {
  // URL ini adalah contoh dari Midtrans Snap. Di aplikasi nyata, 
  // Anda harus membuatnya secara dinamis dari backend Anda untuk setiap transaksi.
  const midtransDemoUrl = "https://app.sandbox.midtrans.com/snap/v1/pay?token=938e4a31-fe8b-4499-a417-b7d19a48e7e1";

  return (
    <div className="space-y-8">
      <div className="pt-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Pilih Paket yang Tepat untuk Anda
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Mulai secara gratis dan upgrade kapan pun Anda membutuhkan fitur yang lebih canggih untuk mendukung perjalanan akademis Anda.
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
              Rp 0<span className="text-lg font-normal text-muted-foreground">/bulan</span>
            </p>
            <ul className="space-y-3">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-muted-foreground">
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
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                Paling Populer
            </div>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
               <Gem className="h-6 w-6 text-primary" />
              <span className="font-headline text-2xl">Premium</span>
            </CardTitle>
            <CardDescription>
              Untuk mahasiswa dan profesional yang membutuhkan kekuatan AI tanpa batas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
             <p className="font-headline text-4xl font-bold">
              Rp 50rb<span className="text-lg font-normal text-muted-foreground">/bulan</span>
            </p>
            <ul className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 font-medium">
                   <Sparkles className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full font-bold" asChild>
                <a href={midtransDemoUrl} target="_blank" rel="noopener noreferrer">
                    Upgrade ke Premium
                </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
       <div className="pt-8 text-center text-sm text-muted-foreground">
        <p className="font-bold">Langkah Selanjutnya:</p>
        <p>Tombol "Upgrade" di atas kini mengarah ke halaman demo pembayaran Midtrans.</p>
        <p>Untuk integrasi penuh, Anda perlu mendaftar di Midtrans, mendapatkan API key, dan membuat link pembayaran dari backend Anda.</p>
      </div>
    </div>
  );
}
