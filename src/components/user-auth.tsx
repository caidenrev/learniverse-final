
'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function getInitials(name: string | null | undefined): string {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export function UserAuth() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();


  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login Berhasil!',
        description: `Selamat datang kembali!`,
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat mencoba login. Silakan coba lagi.',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
       toast({
        title: 'Logout Berhasil',
        description: 'Anda telah berhasil keluar.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
       toast({
        title: 'Logout Gagal',
        description: 'Terjadi kesalahan saat mencoba logout. Silakan coba lagi.',
        variant: 'destructive',
      });
    }
  };

  if (isUserLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  if (!user) {
    return (
      <Button onClick={handleSignIn} variant="outline">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{user.displayName}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
