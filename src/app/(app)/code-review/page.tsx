
'use client';

import { useState } from 'react';
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
import { Loader2, Play, Terminal, Sparkles, Bot, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CodeEditor } from '@/components/code-editor';

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
          logMessages.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
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
        reject(new Error('Eksekusi Python tidak didukung di browser. AI akan tetap mereview kode Anda.'));
    }
  });
};

export default function CodeReviewPage() {
  const [code, setCode] = useState("console.log('Halo Learniverse!');");
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [aiExplanation, setAiExplanation] = useState<CodeReviewerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      try {
        const explanation = await reviewCodeError({
          code,
          language,
          errorMessage: e.message,
        });
        setAiExplanation(explanation);
      } catch (aiError) {
        console.error('AI error review failed:', aiError);
        toast({
          title: 'Gagal Mendapatkan Review AI',
          description: 'Terjadi kesalahan saat mencoba menganalisis error kode Anda.',
          variant: 'destructive',
        });
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
          Tulis kode JavaScript atau Python, jalankan, dan jika ada error, AI akan menjelaskannya untuk Anda.
        </p>
      </div>

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
                onValueChange={(value: 'javascript' | 'python') => setLanguage(value)}
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
            <Button onClick={handleRunCode} disabled={isLoading}>
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
            <CardContent className="min-h-[150px] rounded-md bg-zinc-900 p-4 font-code text-sm text-zinc-50">
              {isLoading && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-zinc-400">Menjalankan kode...</p>
                </div>
              )}
              {output && <pre className="whitespace-pre-wrap">{output}</pre>}
              {error && <pre className="whitespace-pre-wrap text-red-400">{error.message}</pre>}
              {!isLoading && !output && !error && (
                <p className="text-zinc-400">Hasil eksekusi akan muncul di sini.</p>
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
                     <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Masalah</h4>
                     <p className="text-sm text-muted-foreground">{aiExplanation.problem}</p>
                 </div>
                  <div className="space-y-2">
                     <h4 className="font-semibold flex items-center gap-2"><Bot className="h-4 w-4" /> Saran Perbaikan</h4>
                     <p className="text-sm text-muted-foreground">{aiExplanation.solution}</p>
                 </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
