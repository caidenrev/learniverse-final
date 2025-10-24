
'use client';

import { useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useAuth, useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
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
import { LogIn, LogOut, Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleNewUser = async () => {
      if (user && firestore) {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const { email, photoURL } = user;
          const displayName = user.displayName || email?.split('@')[0] || 'User';

          const userData = {
            uid: user.uid,
            displayName,
            email,
            photoURL: photoURL || null, // Ensure it's null if not present
            createdAt: serverTimestamp(),
          };
          
          const subscriptionRef = doc(firestore, `users/${user.uid}/subscriptions`, 'default');
          const subscriptionData = {
              planId: 'free',
              status: 'active',
              currentPeriodEnd: null,
               usage: {
                  summaryCount: 0,
                  paraphraseCount: 0,
                  tutorQuestionCount: 0,
                  lastResetDate: serverTimestamp()
              }
          };

          setDoc(userRef, userData).catch((serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'create',
              requestResourceData: userData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });

          setDoc(subscriptionRef, subscriptionData).catch((serverError) => {
             const subscriptionPermissionError = new FirestorePermissionError({
                path: subscriptionRef.path,
                operation: 'create',
                requestResourceData: subscriptionData,
              });
              errorEmitter.emit('permission-error', subscriptionPermissionError);
          });
        }
      }
    };

    if (!isUserLoading && firestore && user) {
      handleNewUser();
    }
  }, [user, isUserLoading, firestore]);

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logout Berhasil',
        description: 'Anda telah berhasil keluar.',
      });
      window.location.href = '/';
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
      <Button onClick={handleSignIn} variant="outline" className="hidden md:flex">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar>
            {user.photoURL ? (
              <AvatarImage
                src={user.photoURL}
                alt={user.displayName ?? 'User'}
              />
            ) : null}
            <AvatarFallback>
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start md:flex">
            <span className="font-semibold">{user.displayName}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{user.displayName}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/brainstorm-topik" className="cursor-pointer">
            Ke Dasbor
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
