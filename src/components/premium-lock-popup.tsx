
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sparkles, Gem } from 'lucide-react';
import Link from 'next/link';

interface PremiumLockPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
  description: string;
}

export function PremiumLockPopup({
  open,
  onOpenChange,
  featureName,
  description,
}: PremiumLockPopupProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              <Sparkles className="h-10 w-10" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl font-bold">
            Fitur Khusus Premium: {featureName}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <AlertDialogCancel>Nanti Saja</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href="/pricing">
              <Gem className="mr-2 h-4 w-4" />
              Upgrade Sekarang
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
