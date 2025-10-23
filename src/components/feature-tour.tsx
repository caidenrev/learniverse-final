
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { menuItems } from '@/lib/menu-items';

// Flatten the menu items into a single array of features
const tourSteps = menuItems
  .flatMap(group => group.items)
  .filter(item => !['Harga', 'Riwayat Transaksi', 'Tentang', 'Kontak', 'Riwayat Projek'].includes(item.title)); // Exclude non-feature items

const TOUR_STORAGE_KEY = 'learniverse-feature-tour-completed';

export function FeatureTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
    if (hasCompletedTour !== 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose(); // End of tour
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }
    setIsOpen(false);
  };
  
  const currentFeature = tourSteps[currentStep];
  if (!currentFeature) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={handleClose}>
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
             <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <currentFeature.icon className="h-6 w-6" />
             </div>
             <DialogTitle className="text-2xl font-headline">
                {currentFeature.title}
             </DialogTitle>
          </div>
          <DialogDescription>
            {/* Find a more permanent description solution later */}
            Selamat datang di Learniverse! Mari kita lihat fitur-fitur yang ada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 text-sm text-muted-foreground">
          {/* Placeholder descriptions */}
          {currentFeature.title === 'Tutor AI' && 'Unggah materi kuliah Anda dan ajukan pertanyaan spesifik untuk mendapatkan jawaban instan.'}
          {currentFeature.title === 'Roadmap Belajar' && 'Buat roadmap belajar yang terstruktur untuk menguasai topik atau keterampilan baru dari awal hingga mahir.'}
          {currentFeature.title === 'CV Reviewer' && 'Dapatkan ulasan, skor, dan saran perbaikan untuk CV Anda dari AI yang bertindak sebagai HR profesional.'}
          {currentFeature.title === 'Pembuat Pertanyaan' && 'Secara otomatis hasilkan pertanyaan dari materi pelajaran Anda untuk kuis atau bahan diskusi.'}
          {currentFeature.title === 'Brainstorm Topik' && 'Mengalami kebuntuan ide? Hasilkan berbagai ide sub-topik yang menarik dari sebuah tema umum.'}
          {currentFeature.title === 'Kerangka Presentasi' && 'Ubah judul presentasi menjadi kerangka yang logis dan terstruktur, slide demi slide.'}
          {currentFeature.title === 'Pencari Analogi' && 'Sederhanakan konsep teknis yang rumit menjadi lebih mudah dipahami dengan analogi yang relevan.'}
          {currentFeature.title === 'Kerangka Penelitian' && 'Dapatkan draf kerangka penelitian terstruktur untuk skripsi atau tesis sesuai standar akademis.'}
          {currentFeature.title === 'Pencari Referensi Cerdas' && 'Temukan kata kunci alternatif untuk memperluas dan memperdalam pencarian referensi di Google Scholar.'}
          {current{~.title === 'Parafrase Akademik' && 'Susun ulang kalimat atau paragraf untuk menghindari plagiarisme dengan tetap menjaga integritas makna.'}
          {currentFeature.title === 'Peringkas Jurnal' && 'Pahami inti dari jurnal berbahasa Inggris yang padat dalam waktu singkat dengan ringkasan Bahasa Indonesia.'}
          {currentFeature.title === 'Peringkas Dokumen' && 'Dapatkan ringkasan dan kesimpulan instan dari dokumen PDF atau Word yang Anda unggah.'}
        </div>

        <DialogFooter className="flex-col-reverse items-center gap-2 sm:flex-row sm:justify-between">
            <div className="flex items-center space-x-2">
                <Checkbox id="dont-show-again" checked={dontShowAgain} onCheckedChange={(checked) => setDontShowAgain(checked as boolean)} />
                <label htmlFor="dont-show-again" className="text-xs text-muted-foreground">
                    Jangan tampilkan lagi
                </label>
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" onClick={handleClose}>Lewati</Button>
                {currentStep > 0 && <Button variant="outline" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4"/> Kembali</Button>}
                <Button onClick={handleNext}>
                  {currentStep === tourSteps.length - 1 ? 'Selesai' : 'Lanjut'}
                  {currentStep < tourSteps.length - 1 && <ArrowRight className="ml-2 h-4 w-4"/>}
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
