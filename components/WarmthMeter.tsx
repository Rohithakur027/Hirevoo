'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WarmthMeterProps {
  score: number; // 0-100
  showBreakdown?: boolean;
}

export function WarmthMeter({ score, showBreakdown = false }: WarmthMeterProps) {
  const getLabel = () => {
    if (score >= 80) return { label: 'Hot 🔥', color: 'text-red-500' };
    if (score >= 60) return { label: 'Warm', color: 'text-orange-500' };
    if (score >= 40) return { label: 'Lukewarm', color: 'text-amber-500' };
    return { label: 'Cold', color: 'text-blue-500' };
  };

  const { label, color } = getLabel();
  const fillHeight = `${score}%`;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end gap-3">
        {/* Thermometer */}
        <div className="relative w-8 h-32">
          {/* Outer glass */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-muted/50 to-muted border-2 border-muted-foreground/20" />
          
          {/* Inner tube */}
          <div className="absolute inset-1 rounded-full bg-muted/30 overflow-hidden">
            {/* Mercury */}
            <motion.div
              className={cn(
                'absolute bottom-0 left-0 right-0 rounded-full',
                score >= 80 ? 'bg-gradient-to-t from-red-500 to-orange-400' :
                score >= 60 ? 'bg-gradient-to-t from-orange-500 to-amber-400' :
                score >= 40 ? 'bg-gradient-to-t from-amber-500 to-yellow-400' :
                'bg-gradient-to-t from-blue-500 to-cyan-400'
              )}
              initial={{ height: '0%' }}
              animate={{ height: fillHeight }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Bulb */}
          <div className={cn(
            'absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-muted-foreground/20',
            score >= 80 ? 'bg-red-500' :
            score >= 60 ? 'bg-orange-500' :
            score >= 40 ? 'bg-amber-500' :
            'bg-blue-500'
          )} />

          {/* Scale marks */}
          <div className="absolute right-full mr-1 top-0 bottom-6 flex flex-col justify-between text-[8px] text-muted-foreground">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
        </div>

        {/* Labels */}
        <div className="flex flex-col justify-between h-32 text-[10px] text-muted-foreground pb-6">
          <span className="text-red-500">Hot</span>
          <span className="text-orange-500">Warm</span>
          <span className="text-amber-500">Lukewarm</span>
          <span className="text-blue-500">Cold</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm font-medium">Warmth Meter</p>
        <p className={cn('text-xs font-medium', color)}>{label}</p>
      </div>

      {showBreakdown && (
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between gap-4">
            <span>Personalization</span>
            <span className="font-medium">{Math.min(100, score + 10)}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Tone</span>
            <span className="font-medium">{score}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Connection</span>
            <span className="font-medium">{Math.max(0, score - 5)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
