
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email('Format email tidak valid.'),
  password: z.string().min(6, 'Password minimal harus 6 karakter.'),
});

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.108-11.187-7.231l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        toast({
          title: 'Pendaftaran Berhasil!',
          description: 'Selamat datang di Learniverse. Anda akan diarahkan...',
        });
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
          title: 'Login Berhasil!',
          description: 'Selamat datang kembali!',
        });
      }
      router.push('/brainstorm-topik');
    } catch (error: any) {
      console.error(error);
      let description = 'Terjadi kesalahan. Silakan coba lagi.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'Email ini sudah terdaftar. Silakan login.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'Email atau password salah.';
      }
      toast({
        title: isRegistering ? 'Pendaftaran Gagal' : 'Login Gagal',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login Berhasil!',
        description: 'Selamat datang kembali!',
      });
      router.push('/brainstorm-topik');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat mencoba login. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
       <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
            <Link href="/" className="mx-auto mb-4">
                <Logo />
            </Link>
          <CardTitle className="text-2xl font-bold">{isRegistering ? 'Buat Akun Baru' : 'Login ke Akun Anda'}</CardTitle>
          <CardDescription>
            {isRegistering ? 'Isi form di bawah untuk memulai.' : 'Selamat datang kembali! Silakan masukkan detail Anda.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@contoh.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : (isRegistering ? <UserPlus/> : <LogIn />)}
                {isLoading ? 'Memproses...' : (isRegistering ? 'Daftar' : 'Login')}
              </Button>
            </form>
          </Form>

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-xs text-gray-500">ATAU</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
            {isGoogleLoading ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
            {isGoogleLoading ? 'Memproses...' : 'Lanjutkan dengan Google'}
          </Button>

          <div className="mt-6 text-center text-sm">
            {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}
            <Button
              variant="link"
              className="px-1"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Login di sini' : 'Daftar sekarang'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
