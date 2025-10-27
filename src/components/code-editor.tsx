
'use client';

import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  language: 'javascript' | 'python';
  className?: string;
}

export function CodeEditor({
  value,
  onValueChange,
  language,
  className,
}: CodeEditorProps) {
  const highlightWithCls = (code: string) =>
    highlight(code, languages[language], language);

  return (
    <div
      className={cn(
        "relative min-h-[300px] w-full overflow-auto rounded-md border bg-zinc-900 font-code text-sm text-zinc-50 shadow-sm",
        className
      )}
    >
      <Editor
        value={value}
        onValueChange={onValueChange}
        highlight={highlightWithCls}
        padding={16}
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 14,
        }}
        className="[&>textarea]:outline-none"
      />
    </div>
  );
}
