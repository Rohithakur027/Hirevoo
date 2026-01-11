'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  show: boolean;
  recipientName?: string;
  onComplete?: () => void;
  variant?: 'email-sent' | 'campaign-created' | 'lead-added';
}

export function SuccessAnimation({
  show,
  recipientName = 'recipient',
  onComplete,
  variant = 'email-sent',
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggeredConfetti = useRef(false);

  useEffect(() => {
    if (show && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      setIsVisible(true);

      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#fbbf24'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Center burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
        });
      }, 300);

      // Auto-dismiss
      setTimeout(() => {
        setIsVisible(false);
        hasTriggeredConfetti.current = false;
        onComplete?.();
      }, 4000);
    } else if (!show) {
      hasTriggeredConfetti.current = false;
    }
  }, [show, onComplete]);

  const getContent = () => {
    switch (variant) {
      case 'email-sent':
        return {
          icon: Send,
          title: 'Email Sent! 🎉',
          subtitle: `Your personalized email is on its way to ${recipientName}`,
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        };
      case 'campaign-created':
        return {
          icon: Wand2,
          title: 'Campaign Created! ✨',
          subtitle: 'Your campaign is ready to start sending',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
        };
      case 'lead-added':
        return {
          icon: CheckCircle2,
          title: 'Lead Added! 👍',
          subtitle: `${recipientName} has been added to your leads`,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        };
      default:
        return {
          icon: CheckCircle2,
          title: 'Success!',
          subtitle: 'Action completed successfully',
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative"
          >
            {/* Glow effect */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                'absolute inset-0 rounded-3xl blur-xl',
                content.bgColor
              )}
            />

            {/* Card */}
            <div className="relative bg-background rounded-2xl p-8 shadow-2xl border border-border/50 text-center min-w-[300px]">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className={cn(
                  'mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4',
                  content.bgColor
                )}
              >
                <Icon className={cn('h-10 w-10', content.color)} />
              </motion.div>

              {/* Checkmark animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-2"
              >
                {content.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground"
              >
                {content.subtitle}
              </motion.p>

              {/* Sparkle decorations */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: Math.cos((i / 6) * Math.PI * 2) * 80,
                    y: Math.sin((i / 6) * Math.PI * 2) * 80,
                  }}
                  transition={{
                    delay: 0.5 + i * 0.1,
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Wand2 className="h-4 w-4 text-primary" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast variant for less intrusive success
export function SuccessToast({
  show,
  message,
  onComplete,
}: {
  show: boolean;
  message: string;
  onComplete?: () => void;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[100]"
        >
          <div className="flex items-center gap-3 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle2 className="h-5 w-5" />
            </motion.div>
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
