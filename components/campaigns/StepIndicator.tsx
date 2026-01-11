'use client';

import { motion } from 'framer-motion';
import { Check, Upload, PenSquare, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CampaignStep } from '@/types';

interface StepIndicatorProps {
  currentStep: CampaignStep;
  onStepClick?: (step: CampaignStep) => void;
  completedSteps?: CampaignStep[];
}

const steps = [
  { id: 1, label: 'Upload Contacts', icon: Upload },
  { id: 2, label: 'Compose Emails', icon: PenSquare },
  { id: 3, label: 'Send', icon: Send },
] as const;

export function StepIndicator({ currentStep, onStepClick, completedSteps = [] }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id as CampaignStep);
          const isCurrent = currentStep === step.id;
          const isPending = !isCompleted && !isCurrent;
          const canClick = isCompleted || isCurrent;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <motion.button
                onClick={() => canClick && onStepClick?.(step.id as CampaignStep)}
                disabled={!canClick}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                  isCompleted && 'bg-emerald-500 border-emerald-500 text-white',
                  isCurrent && 'bg-primary border-primary text-white',
                  isPending && 'bg-muted border-muted-foreground/30 text-muted-foreground',
                  canClick && 'cursor-pointer hover:scale-105',
                  !canClick && 'cursor-not-allowed'
                )}
                whileHover={canClick ? { scale: 1.05 } : {}}
                whileTap={canClick ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Step Label */}
              <div className="ml-3 mr-8 hidden sm:block">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCurrent && 'text-primary',
                    isCompleted && 'text-emerald-600 dark:text-emerald-400',
                    isPending && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:flex items-center mr-4">
                  <div
                    className={cn(
                      'w-16 h-0.5 transition-colors',
                      isCompleted ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                    )}
                  />
                  <div
                    className={cn(
                      'w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent',
                      isCompleted ? 'border-l-emerald-500' : 'border-l-muted-foreground/30'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Label */}
      <div className="sm:hidden text-center mt-3">
        <p className="text-sm font-medium text-primary">
          Step {currentStep}: {steps[currentStep - 1].label}
        </p>
      </div>
    </div>
  );
}
