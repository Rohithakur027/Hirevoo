'use client';

import { motion } from 'framer-motion';
import { PipelineCounts } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PipelineMiniProps {
  counts: PipelineCounts;
}

const stages = [
  { key: 'researching', label: 'Researching', shortLabel: 'Res', color: 'bg-slate-500' },
  { key: 'sent', label: 'Sent', shortLabel: 'Sent', color: 'bg-indigo-500' },
  { key: 'response', label: 'Response', shortLabel: 'Resp', color: 'bg-amber-500' },
  { key: 'interview', label: 'Interview', shortLabel: 'Int', color: 'bg-emerald-500' },
] as const;

export function PipelineMini({ counts }: PipelineMiniProps) {
  return (
    <Link href="/applications">
      <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer overflow-x-auto">
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex items-center shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg',
                stage.color,
                'text-white text-xs sm:text-sm font-medium'
              )}
            >
              <span className="sm:hidden">{stage.shortLabel}</span>
              <span className="hidden sm:inline">{stage.label}</span>
              <span className="bg-white/20 px-1.5 rounded">
                {counts[stage.key]}
              </span>
            </motion.div>
            {index < stages.length - 1 && (
              <ChevronRight className="hidden sm:block h-4 w-4 text-muted-foreground mx-1" />
            )}
          </div>
        ))}
      </div>
    </Link>
  );
}
