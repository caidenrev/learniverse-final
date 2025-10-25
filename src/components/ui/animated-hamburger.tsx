
'use client';

import { cn } from '@/lib/utils';

interface AnimatedHamburgerProps {
  open: boolean;
  onClick: () => void;
  className?: string;
  color?: string;
}

export function AnimatedHamburger({
  open,
  onClick,
  className,
  color = 'hsl(var(--primary))', // Default color
}: AnimatedHamburgerProps) {
  const lineStyle: React.CSSProperties = {
    transition: 'all 0.5s',
    stroke: 'currentColor', // Use currentColor to inherit from parent
    strokeWidth: 6,
    strokeLinecap: 'round',
  };

  const lineTopStyle: React.CSSProperties = {
    ...lineStyle,
    strokeDasharray: '40 40',
    strokeDashoffset: open ? '0' : '25',
    transform: open ? 'rotateZ(45deg) translate(-7px, -5px)' : 'none',
    transformOrigin: 'left',
  };

  const lineMidStyle: React.CSSProperties = {
    ...lineStyle,
    strokeDasharray: '40 40',
    strokeDashoffset: open ? '40' : '0',
  };

  const lineBottomStyle: React.CSSProperties = {
    ...lineStyle,
    strokeDasharray: '40 40',
    strokeDashoffset: open ? '0' : '60',
    transform: open ? 'rotateZ(-45deg) translate(-5px, 5px)' : 'none',
    transformOrigin: 'left',
  };

  return (
    <button
      onClick={onClick}
      className={cn('relative h-8 w-8 transition-transform duration-200 focus:outline-none', className)}
      aria-label="Toggle menu"
      style={{
        color, // Apply color to the button, which SVG will inherit
        transition: 'color 0.3s ease-in-out',
        transitionDelay: open ? '0.5s' : '0s', // Delay color change on open
      }}
    >
      <svg fill="none" viewBox="0 0 50 50" height="32" width="32">
        <path style={lineTopStyle} d="M6 11L44 11" />
        <path style={lineMidStyle} d="M6 24H43" />
        <path style={lineBottomStyle} d="M6 37H43" />
      </svg>
    </button>
  );
}
