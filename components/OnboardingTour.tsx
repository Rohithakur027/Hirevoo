'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { X, ArrowRight, ArrowLeft, Wand2, Target, Shield, CheckCircle2 } from 'lucide-react';

interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  description: string;
  icon: typeof Wand2;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'personal-touch',
    target: '[data-tour="personal-touch"]',
    title: 'The Magic Ingredient ✨',
    description: 'This is where the magic happens! Add personal details about your leads - their achievements, interests, or recent posts. Our AI uses this to craft emails that feel genuinely human.',
    icon: Wand2,
    position: 'right',
  },
  {
    id: 'spam-score',
    target: '[data-tour="spam-score"]',
    title: 'Spam Score Analysis 🛡️',
    description: 'See exactly how likely your email is to land in spam. We highlight problematic words and give you suggestions to improve deliverability.',
    icon: Shield,
    position: 'left',
  },
  {
    id: 'quality-score',
    target: '[data-tour="quality-score"]',
    title: 'Quality Score 🎯',
    description: 'Our AI rates your email\'s effectiveness. Higher scores mean better personalization, clearer CTAs, and more engaging content.',
    icon: Target,
    position: 'left',
  },
  {
    id: 'warmth-meter',
    target: '[data-tour="warmth-meter"]',
    title: 'Email Warmth 🔥',
    description: 'See how warm and personalized your email feels. Cold emails get ignored - warm emails get replies!',
    icon: Wand2,
    position: 'bottom',
  },
];

interface OnboardingTourProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function OnboardingTour({ onComplete, forceShow = false }: OnboardingTourProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Check if user has completed the tour
    const hasCompletedTour = localStorage.getItem('coldai-tour-completed');
    if (!hasCompletedTour || forceShow) {
      // Delay to let the page render
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, [forceShow]);

  useEffect(() => {
    if (!isVisible) return;

    const step = tourSteps[currentStep];
    const target = document.querySelector(step.target);
    
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);
      
      // Scroll target into view
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('coldai-tour-completed', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem('coldai-tour-completed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (!targetRect) return {};

    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    switch (step.position) {
      case 'right':
        return {
          left: targetRect.right + padding,
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
        };
      case 'left':
        return {
          left: targetRect.left - tooltipWidth - padding,
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
        };
      case 'bottom':
        return {
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          top: targetRect.bottom + padding,
        };
      case 'top':
        return {
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          top: targetRect.top - tooltipHeight - padding,
        };
      default:
        return {};
    }
  };

  // Arrow direction
  const getArrowClass = () => {
    switch (step.position) {
      case 'right': return 'left-0 -translate-x-full top-1/2 -translate-y-1/2 border-r-primary';
      case 'left': return 'right-0 translate-x-full top-1/2 -translate-y-1/2 border-l-primary';
      case 'bottom': return 'top-0 -translate-y-full left-1/2 -translate-x-1/2 border-b-primary';
      case 'top': return 'bottom-0 translate-y-full left-1/2 -translate-x-1/2 border-t-primary';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={handleSkip}
          />

          {/* Spotlight on target */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[101] rounded-lg ring-4 ring-primary ring-offset-4 ring-offset-background pointer-events-none"
              style={{
                left: targetRect.left - 8,
                top: targetRect.top - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            >
              {/* Pulse animation */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-lg bg-primary/20"
              />
            </motion.div>
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[102] w-80"
            style={getTooltipStyle()}
          >
            <Card className="shadow-2xl border-primary/20 overflow-hidden">
              {/* Arrow */}
              <div className={cn(
                'absolute w-0 h-0 border-8 border-transparent',
                getArrowClass()
              )} />

              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold">{step.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleSkip}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {step.description}
                </p>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {tourSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        index === currentStep
                          ? 'w-4 bg-primary'
                          : index < currentStep
                          ? 'w-1.5 bg-primary/50'
                          : 'w-1.5 bg-muted'
                      )}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip tour
                  </Button>
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button variant="outline" size="sm" onClick={handlePrev}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" onClick={handleNext} className="gap-1">
                      {currentStep < tourSteps.length - 1 ? (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Done
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to reset tour for testing
export function useResetTour() {
  return () => {
    localStorage.removeItem('coldai-tour-completed');
    window.location.reload();
  };
}
