
'use client';

import { useRef, type ElementRef, type ReactNode } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  noVertical?: boolean;
  viewTriggerOffset?: string;
  delay?: number;
  custom?: number;
}

export function FadeIn({
  children,
  className,
  as = 'div',
  noVertical = false,
  viewTriggerOffset = '300px',
  delay: initialDelay = 0.2,
  custom,
}: FadeInProps) {
  const ref = useRef<ElementRef<typeof as>>(null);
  const inView = useInView(ref, {
    once: true,
    margin: `0px 0px -${viewTriggerOffset} 0px`,
  });

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: noVertical ? 0 : 24,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: initialDelay + i * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    }),
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={custom}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  );
}
