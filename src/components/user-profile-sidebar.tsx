
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
import { LogOut, BookText, Repeat, Infinity, User, Terminal } from 'lucide-react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function getInitials(name: string | null | undefined): string {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getFirstName(name: string | null | undefined): string {
    if (!name) return 'User';
    return name.split(' ')[0];
}

const PARAPHRASE_LIMIT = 10;
const CODE_REVIEW_LIMIT = 10;

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

  const isPremium = subscription?.planId === 'premium';
  const remainingParaphrases = PARAPHRASE_LIMIT - (subscription?.usage?.paraphraseCount || 0);
  const remainingCodeReviews = CODE_REVIEW_LIMIT - (subscription?.usage?.codeReviewCount || 0);

  return (
    <div className="space-y-1 rounded-lg bg-card p-2 text-card-foreground">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer rounded-md p-2 transition-colors hover:bg-muted">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.displayName ?? 'User'} />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold">
                  {user.displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="py-1 px-2 text-xs font-medium text-muted-foreground hover:no-underline">
            Lihat Detail Penggunaan
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 px-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status Paket</span>
                <span className="font-medium capitalize">
                  {isSubscriptionLoading ? (
                    <Skeleton className="h-4 w-12" />
                  ) : (
                    subscription?.planId || 'Gratis'
                  )}
                </span>
              </div>
              {!isPremium && (
                   <>
                      <p className="font-medium text-muted-foreground pt-2 pb-1 border-t border-border">Sisa Kuota Harian:</p>
                       <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-muted-foreground"><Repeat className="w-3.5 h-3.5"/> Parafrase</span>
                        <span className="font-medium">
                          {isSubscriptionLoading ? (
                            <Skeleton className="h-4 w-8" />
                          ) : (
                            `${remainingParaphrases < 0 ? 0 : remainingParaphrases} / ${PARAPHRASE_LIMIT}`
                          )}
                        </span>
                      </div>
                       <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-muted-foreground"><Terminal className="w-3.5 h-3.5"/> Code Review</span>
                        <span className="font-medium">
                          {isSubscriptionLoading ? (
                            <Skeleton className="h-4 w-8" />
                          ) : (
                            `${remainingCodeReviews < 0 ? 0 : remainingCodeReviews} / ${CODE_REVIEW_LIMIT}`
                          )}
                        </span>
                      </div>
                   </>
              )}
               {isPremium && (
                   <>
                      <p className="font-medium text-muted-foreground pt-2 pb-1 border-t border-border">Kuota Penggunaan:</p>
                       <div className="flex justify-center items-center gap-2 p-2 rounded-md bg-muted/50 text-foreground">
                          <Infinity className="w-4 h-4 text-primary"/>
                          <span className="font-bold">Tanpa Batas</span>
                      </div>
                   </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
