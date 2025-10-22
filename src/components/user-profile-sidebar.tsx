
'use client';

import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
} from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

function getInitials(name: string | null | undefined): string {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

const USAGE_LIMIT = 3; // Daily limit for summaries

export function UserProfileSidebar() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const subscriptionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'subscriptions', 'default');
  }, [firestore, user]);

  const { data: subscription, isLoading: isSubscriptionLoading } =
    useDoc(subscriptionRef);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't show anything if user is not logged in
  }

  const remainingSummaries = isSubscriptionLoading
    ? -1
    : USAGE_LIMIT - (subscription?.usage?.summaryCount || 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {user.email}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-sidebar-foreground/70">Status Paket</span>
              <span className="font-medium capitalize text-sidebar-foreground">
                {isSubscriptionLoading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  subscription?.planId || 'Gratis'
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sidebar-foreground/70">Sisa Kuota</span>
              <span className="font-medium text-sidebar-foreground">
                {isSubscriptionLoading ? (
                  <Skeleton className="h-4 w-8" />
                ) : (
                  `${remainingSummaries < 0 ? 0 : remainingSummaries} / ${USAGE_LIMIT}`
                )}
              </span>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" side="top" sideOffset={8}>
        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/pricing" className="cursor-pointer">Upgrade Paket</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
