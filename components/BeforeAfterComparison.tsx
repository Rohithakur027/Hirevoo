'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Wand2, FileText, GripVertical, Sparkles } from 'lucide-react';

interface BeforeAfterComparisonProps {
  leadName: string;
  companyName: string;
  personalTouch: string;
  genericEmail?: string;
  personalizedEmail?: string;
}

export function BeforeAfterComparison({
  leadName,
  companyName,
  personalTouch,
  genericEmail,
  personalizedEmail,
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const defaultGeneric = `Hi there,

I hope this email finds you well. I wanted to reach out because I think our product could help your company.

We offer solutions that help businesses improve their processes. Many companies have seen great results with us.

Would you be interested in learning more?

Best regards`;

  const defaultPersonalized = `Hi ${leadName},

${personalTouch ? `I noticed ${personalTouch} - that really caught my attention!` : `I've been following ${companyName}'s journey`}

Given what you're working on at ${companyName}, I think you'd find our approach to personalized outreach fascinating. We're helping teams like yours achieve 3x higher response rates.

${personalTouch ? `Based on ${personalTouch.split(' ').slice(0, 5).join(' ')}..., I have some specific ideas that might interest you.` : 'I have some specific ideas that might interest you.'}

Would love to share more - worth a quick 15-minute chat?

Cheers`;

  const generic = genericEmail || defaultGeneric;
  const personalized = personalizedEmail || defaultPersonalized;

  // Find personalized parts (simple highlighting)
  const getHighlightedText = (text: string) => {
    const personalizedParts = [leadName, companyName];
    if (personalTouch) {
      personalizedParts.push(...personalTouch.split(' ').slice(0, 3));
    }
    
    let result = text;
    personalizedParts.forEach(part => {
      if (part && part.length > 2) {
        result = result.replace(
          new RegExp(part, 'gi'),
          `<mark class="bg-emerald-200 dark:bg-emerald-800/50 px-0.5 rounded">${part}</mark>`
        );
      }
    });
    return result;
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 5), 95));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 5), 95));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Before / After Comparison
          </span>
          <span className="text-xs text-muted-foreground font-normal">
            Drag slider to compare
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="relative h-80 rounded-lg overflow-hidden cursor-col-resize select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Generic Email (Before) */}
          <div className="absolute inset-0 bg-muted/30 p-4 overflow-auto">
            <Badge variant="secondary" className="mb-3 bg-muted">
              <FileText className="h-3 w-3 mr-1" />
              Generic Email
            </Badge>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
              {generic}
            </pre>
          </div>

          {/* Personalized Email (After) - Clipped */}
          <motion.div
            className="absolute inset-0 bg-background p-4 overflow-auto"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Badge className="mb-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Wand2 className="h-3 w-3 mr-1" />
              Personalized Email
            </Badge>
            <pre
              className="whitespace-pre-wrap text-sm"
              dangerouslySetInnerHTML={{ __html: getHighlightedText(personalized) }}
            />
          </motion.div>

          {/* Slider Handle */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize z-10"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Handle grip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <GripVertical className="h-5 w-5 text-primary-foreground" />
            </div>
            
            {/* Labels */}
            <div className="absolute -left-16 top-2 text-xs font-medium text-muted-foreground">
              Before
            </div>
            <div className="absolute left-4 top-2 text-xs font-medium text-primary">
              After
            </div>
          </motion.div>

          {/* Gradient overlays for visual depth */}
          <div 
            className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-muted/50 to-transparent pointer-events-none"
          />
          <div 
            className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-background/50 to-transparent pointer-events-none"
          />
        </div>

        {/* Stats comparison */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Generic Response Rate</p>
            <p className="text-2xl font-bold text-muted-foreground">~5%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Personalized Response Rate</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
            >
              ~22%
            </motion.p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
