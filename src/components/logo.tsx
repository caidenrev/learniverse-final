import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div className="rounded-lg bg-primary p-1.5">
        <GraduationCap className="h-5 w-5 text-primary-foreground" />
      </div>
      {withText && (
        <span className="font-headline text-xl font-bold">Learniverse</span>
      )}
    </Link>
  );
}
