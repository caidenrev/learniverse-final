'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// TypeScript interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      // Hide the app-provided install promotion
      setDeferredPrompt(null);
      setIsAppInstalled(true);
    };
    
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsAppInstalled(true);
    }

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    await deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, so clear it
    setDeferredPrompt(null);
  };

  if (!deferredPrompt || isAppInstalled) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleInstallClick}
      className="hidden md:inline-flex"
    >
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  );
}