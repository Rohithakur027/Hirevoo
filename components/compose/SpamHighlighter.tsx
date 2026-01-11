'use client';

import type { ReactNode } from 'react';
import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { spamWords } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface SpamHighlighterProps {
  text: string;
  onChange?: (text: string) => void;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
}

interface SpamMatch {
  word: string;
  start: number;
  end: number;
  reason: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

export function SpamHighlighter({ 
  text, 
  onChange, 
  readOnly = false,
  className,
  placeholder = "Press / for AI assistance"
}: SpamHighlighterProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const spamMatches = useMemo(() => {
    const matches: SpamMatch[] = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(spamWords).forEach(([word, data]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(lowerText)) !== null) {
        matches.push({
          word: text.slice(match.index, match.index + word.length),
          start: match.index,
          end: match.index + word.length,
          reason: data.reason,
          suggestion: data.suggestion,
          severity: data.severity,
        });
      }
    });
    
    return matches.sort((a, b) => a.start - b.start);
  }, [text]);

  const renderHighlightedText = () => {
    if (spamMatches.length === 0) {
      return <span>{text}</span>;
    }

    const parts: ReactNode[] = [];
    let lastEnd = 0;

    spamMatches.forEach((match, index) => {
      // Add text before the match
      if (match.start > lastEnd) {
        parts.push(
          <span key={`text-${index}`}>{text.slice(lastEnd, match.start)}</span>
        );
      }

      // Add the highlighted spam word
      const severityColors = {
        high: 'bg-red-200 dark:bg-red-900/50 border-red-400 dark:border-red-700',
        medium: 'bg-amber-200 dark:bg-amber-900/50 border-amber-400 dark:border-amber-700',
        low: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-700',
      };

      parts.push(
        <Popover key={`spam-${index}`}>
          <PopoverTrigger asChild>
            <span
              className={cn(
                'cursor-help border-b-2 rounded px-0.5 transition-colors',
                severityColors[match.severity],
                hoveredWord === match.word && 'ring-2 ring-primary'
              )}
              onMouseEnter={() => setHoveredWord(match.word)}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {match.word}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" side="top">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                  match.severity === 'high' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                  match.severity === 'medium' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                  match.severity === 'low' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                )}>
                  {match.severity.toUpperCase()}
                </span>
                <span className="text-sm font-medium">&quot;{match.word}&quot;</span>
              </div>
              <p className="text-xs text-muted-foreground">{match.reason}</p>
              <p className="text-xs">
                <span className="text-primary">💡</span> {match.suggestion}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      );

      lastEnd = match.end;
    });

    // Add remaining text
    if (lastEnd < text.length) {
      parts.push(<span key="text-end">{text.slice(lastEnd)}</span>);
    }

    return <>{parts}</>;
  };

  if (readOnly) {
    return (
      <div className={cn("whitespace-pre-wrap text-sm leading-relaxed", className)}>
        {renderHighlightedText()}
      </div>
    );
  }

  return (
    <div className={cn("relative h-full", className)}>
      <div className="absolute inset-0 p-3 pointer-events-none whitespace-pre-wrap text-sm leading-relaxed overflow-auto">
        {renderHighlightedText()}
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-full min-h-[280px] p-3 bg-transparent text-transparent caret-foreground resize-none focus:outline-none text-sm leading-relaxed"
        placeholder={placeholder}
      />
    </div>
  );
}
