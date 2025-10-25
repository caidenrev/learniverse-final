
'use client';

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AnimatedButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function AnimatedButton({ href, className, children }: AnimatedButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative mt-4 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-transparent px-8 py-4 text-base font-bold text-primary transition-all duration-500 ease-in-out hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
    >
      <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-3">
        {children}
      </span>
      <ArrowRight className="absolute right-8 z-10 h-5 w-5 opacity-0 transition-all duration-300 group-hover:right-5 group-hover:opacity-100" />
    </Link>
  );
}
