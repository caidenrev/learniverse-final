
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { reviewCodeError } from '@/ai/flows/code-reviewer';
import type { CodeReviewerOutput } from '@/ai/flows/code-reviewer-schemas';
import {
  Loader2,
  Play,
  Terminal,
  Sparkles,
  Bot,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CodeEditor } from '@/components/code-editor';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import {
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  writeBatch,
  getDoc,
} from 'firebase/firestore';
import Link from 'next/link';

// This is a simplified, client-side sandbox. It is NOT secure for untrusted code.
// For this educational tool, it's an acceptable tradeoff.
const runCodeInBrowser = (code: string, language: 'javascript' | 'python') => {
  return new Promise((resolve, reject) => {
    if (language === 'javascript') {
      try {
        // Capture console.log output
        const logMessages: any[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logMessages.push(
            args
              .map((arg) =>
                typeof arg === 'object' ? JSON.stringify(arg) : arg
              )
              .join(' ')
          );
        };

        // eslint-disable-next-line no-new-func
        const result = new Function(code)();

        // Restore console.log
        console.log = originalLog;

        let output = logMessages.join('\n');
        if (result !== undefined) {
          output += (output ? '\n' : '') + `Return Value: ${result}`;
        }

        resolve(output || 'Eksekusi selesai tanpa output eksplisit.');
      } catch (error: any) {
        reject(error);
      }
    } else {
      // Python execution is not possible in the browser.
      // We will just send it to AI for review without running.
      reject(
        new Error(
          'Eksekusi Python tidak didukung di browser. AI akan tetap mereview kode Anda.'
        )
      );
    }
  });
};

const USAGE_LIMIT = 10;

export default function CodeReviewPage() {
  const [code, setCode] = useState("console.log('Halo Learniverse!');");
  const [language, setLanguage] = useState<'javascript' | 'python'>(
    'javascript'
  );
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [aiExplanation, setAiExplanation] =
    useState<CodeReviewerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { user } = useUser();
  const firestore = useFirestore();

  const subscriptionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'subscriptions', 'default');
  }, [firestore, user]);

  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    mutate,
  } = useDoc(subscriptionRef);
  
  const planId = useMemo(() => subscription?.planId ?? 'free', [subscription]);

  // Daily reset logic
  const checkAndResetUsage = useMemo(() => async () => {
    if (!subscriptionRef || !firestore ) return;
    
    // We need to get a fresh document snapshot here to check the date
    const currentSubDoc = await getDoc(subscriptionRef);
    if (!currentSubDoc.exists()) return;

    const subData = currentSubDoc.data();
    if(subData.planId === 'premium') return;

    const lastReset = subData.usage?.lastResetDate?.toDate();
    if (!lastReset) {
      await updateDoc(subscriptionRef, {
        'usage.lastResetDate': serverTimestamp(),
      });
      return;
    }
    const now = new Date();
    const hoursSinceLastReset =
      (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastReset >= 24) {
      const batch = writeBatch(firestore);
      batch.update(subscriptionRef, {
        'usage.summaryCount': 0,
        'usage.paraphraseCount': 0,
        'usage.tutorQuestionCount': 0,
        'usage.codeReviewCount': 0,
        'usage.lastResetDate': serverTimestamp(),
      });
      await batch.commit();
      await mutate(); // Re-fetches the subscription data for the hook
      toast({
        title: 'Kuota Harian Direset',
        description:
          'Kuota penggunaan gratis Anda telah diperbarui untuk hari ini.',
      });
    }
  }, [subscriptionRef, firestore, mutate, toast]);
  
  useEffect(() => {
    if (user && subscription) {
        checkAndResetUsage();
    }
  }, [user, subscription, checkAndResetUsage]);

  const remainingReviews = useMemo(() => {
    if (planId === 'premium') return Infinity;
    return USAGE_LIMIT - (subscription?.usage?.codeReviewCount || 0);
  }, [subscription, planId]);
  
  const isLimitReached = useMemo(() => !isSubscriptionLoading && remainingReviews <= 0, [isSubscriptionLoading, remainingReviews]);

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput(null);
    setError(null);
    setAiExplanation(null);

    try {
      const result = await runCodeInBrowser(code, language);
      setOutput(result as string);
    } catch (e: any) {
      setError(e);
      
      // Check for usage limit only if an error occurs
      await checkAndResetUsage();
      await mutate(); // Re-fetch to get the latest count
      
      const currentRemainingReviews = planId === 'premium' ? Infinity : USAGE_LIMIT - (subscription?.usage?.codeReviewCount || 0);

      if (planId === 'free' && currentRemainingReviews <= 0) {
        toast({
            title: 'Kuota Review Kode Habis',
            description: 'Anda telah mencapai batas harian untuk penjelasan error oleh AI. Silakan upgrade.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      try {
        const explanation = await reviewCodeError({
          code,
          language,
          errorMessage: e.message,
          planId,
        });
        setAiExplanation(explanation);

        if (planId === 'free' && subscriptionRef) {
            await updateDoc(subscriptionRef, {
                'usage.codeReviewCount': increment(1),
            });
            toast({
                title: 'AI Menemukan Error!',
                description: `Sisa kuota review hari ini: ${currentRemainingReviews - 1}`,
            });
            mutate(); // Update local state after incrementing
        } else if (planId === 'premium') {
             toast({
              title: 'AI Menemukan Error!',
              description: 'AI sedang menjelaskan masalahnya untuk Anda.',
            });
        }

      } catch (aiError: any) {
        console.error('AI error review failed:', aiError);
        const errorMessage = aiError.message || '';
        if (errorMessage.includes('503')) {
            toast({
              title: 'Model AI Sibuk',
              description: 'Model AI sedang kelebihan beban. Silakan coba lagi beberapa saat.',
              variant: 'destructive',
            });
        } else {
            toast({
              title: 'Gagal Mendapatkan Review AI',
              description:
                'Terjadi kesalahan saat mencoba menganalisis error kode Anda.',
              variant: 'destructive',
            });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Code Review & Sandbox
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tulis kode, jalankan, dan jika ada error, AI akan menjelaskannya
          untuk Anda.
        </p>
      </div>
      
      {user && isLimitReached && (
        <Card className="border-amber-500 bg-amber-50/50">
          <CardContent className="flex items-center gap-4 p-4">
            <ShieldAlert className="h-8 w-8 text-amber-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">
                Kuota Review AI Telah Habis
              </h3>
              <p className="text-sm text-amber-700">
                Upgrade ke paket Premium untuk review kode tanpa batas. Kuota gratis direset setiap 24 jam.
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing">Upgrade Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Editor Kode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bahasa</Label>
              <RadioGroup
                defaultValue="javascript"
                value={language}
                onValueChange={(value: 'javascript' | 'python') =>
                  setLanguage(value)
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="javascript" id="js" />
                  <Label htmlFor="js">JavaScript</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="python" id="py" />
                  <Label htmlFor="py">Python</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code-editor">Kode Anda</Label>
              <CodeEditor
                value={code}
                onValueChange={setCode}
                language={language}
              />
            </div>
            <Button onClick={handleRunCode} disabled={isLoading || (isLimitReached && language === 'python')}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Jalankan Kode
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-6 w-6" />
                <span>Output Kode</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[150px] rounded-md bg-muted p-4 font-code text-sm text-foreground">
              {isLoading && !output && !error && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Menjalankan kode...</p>
                </div>
              )}
              {output && <pre className="whitespace-pre-wrap">{output}</pre>}
              {error && (
                <pre className="whitespace-pre-wrap text-red-500">
                  {error.message}
                </pre>
              )}
              {!isLoading && !output && !error && (
                <p className="text-muted-foreground">
                  Hasil eksekusi akan muncul di sini.
                </p>
              )}
            </CardContent>
          </Card>

          {aiExplanation && (
            <Card className="border-primary/50 bg-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-6 w-6" />
                  <span>Penjelasan AI</span>
                </CardTitle>
                <CardDescription className="text-primary/80">
                  AI mendeteksi ada masalah. Berikut penjelasannya.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" /> Masalah
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {aiExplanation.problem}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <Bot className="h-4 w-4" /> Saran Perbaikan
                  </h4>
                  <div
                    className="prose prose-sm max-w-none text-sm text-muted-foreground prose-p:text-muted-foreground prose-pre:bg-background/50"
                    dangerouslySetInnerHTML={{ __html: aiExplanation.solution }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

    