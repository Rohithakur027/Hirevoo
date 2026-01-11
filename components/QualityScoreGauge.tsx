'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, Wand2 } from 'lucide-react';

interface QualityScoreGaugeProps {
  score: number; // 0-100, higher is better
  size?: 'sm' | 'md';
}

export function QualityScoreGauge({ score, size = 'md' }: QualityScoreGaugeProps) {
  const getColor = () => {
    if (score >= 80) return { bg: 'text-emerald-500', label: 'Excellent' };
    if (score >= 60) return { bg: 'text-blue-500', label: 'Good' };
    if (score >= 40) return { bg: 'text-amber-500', label: 'Fair' };
    return { bg: 'text-red-500', label: 'Needs Work' };
  };

  const { bg, label } = getColor();
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - score / 100);

  const dimensions = size === 'sm' ? 'w-24 h-24' : 'w-32 h-32';
  const textSize = size === 'sm' ? 'text-xl' : 'text-2xl';

  return (
    <div className="flex flex-col items-center">
      <div className={cn('relative', dimensions)}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={bg}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn('font-bold', textSize)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-medium">Quality Score</p>
        <div className={cn('flex items-center gap-1 text-xs', bg)}>
          {score >= 80 ? (
            <Wand2 className="h-3 w-3" />
          ) : (
            <Star className="h-3 w-3" />
          )}
          {label}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Higher is better</p>
      </div>
    </div>
  );
}
 